package com.cadu.erp.security.controller;

import com.cadu.erp.security.model.Usuario;
import com.cadu.erp.security.UsuarioRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.cadu.erp.security.model.Role;
import com.cadu.erp.security.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;

    public UsuarioController(UsuarioRepository usuarioRepository, RoleRepository roleRepository) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioCadastroRequest request) {
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getNomeCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getSenhaProvisoria()); // Ideal: criptografar senha
        usuario.setAtivo(true);
        Role role = roleRepository.findByName(request.getFuncao()).orElse(null);
        if (role == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        usuario.getRoles().add(role);
        Usuario salvo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioCadastroRequest request) {
        return usuarioRepository.findById(id)
            .map(usuario -> {
                usuario.setUsername(request.getNomeCompleto());
                usuario.setEmail(request.getEmail());
                usuario.setAtivo(request.getAtivo() != null ? request.getAtivo() : usuario.getAtivo());
                if (request.getSenhaProvisoria() != null && !request.getSenhaProvisoria().isEmpty()) {
                    usuario.setPassword(request.getSenhaProvisoria()); // Ideal: criptografar senha
                }
                if (request.getFuncao() != null) {
                    Role role = roleRepository.findByName(request.getFuncao()).orElse(null);
                    if (role != null) {
                        usuario.getRoles().clear();
                        usuario.getRoles().add(role);
                    }
                }
                Usuario salvo = usuarioRepository.save(usuario);
                return ResponseEntity.ok(salvo);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    public static class UsuarioCadastroRequest {
        private String nomeCompleto;
        private String email;
        private String senhaProvisoria;
        private String funcao;
        private Boolean ativo;
        // getters e setters
        public String getNomeCompleto() { return nomeCompleto; }
        public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenhaProvisoria() { return senhaProvisoria; }
        public void setSenhaProvisoria(String senhaProvisoria) { this.senhaProvisoria = senhaProvisoria; }
        public String getFuncao() { return funcao; }
        public void setFuncao(String funcao) { this.funcao = funcao; }
        public Boolean getAtivo() { return ativo; }
        public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    }
} 