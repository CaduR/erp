package com.cadu.erp.security;

import com.cadu.erp.security.model.Role;
import com.cadu.erp.security.model.Usuario;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Iniciando DataInitializer ===");
        
        try {
            // Criar roles se não existirem
            Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ADMIN");
                return roleRepository.save(newRole);
            });

            Role userRole = roleRepository.findByName("USER").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("USER");
                return roleRepository.save(newRole);
            });

            // Verificar se já existe usuário admin
            System.out.println("Verificando se usuário admin existe...");
            var adminOptional = usuarioRepository.findByUsername("admin");
            System.out.println("Consulta findByUsername executada");
            
            if (adminOptional.isEmpty()) {
                System.out.println("Criando usuário admin...");
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                String encodedPassword = passwordEncoder.encode("admin");
                admin.setPassword(encodedPassword);
                admin.setEmail("admin@erp.com");
                admin.setAtivo(true);
                admin.setRoles(new HashSet<>(Arrays.asList(adminRole, userRole))); // Atribui roles
                
                System.out.println("Senha codificada: " + encodedPassword);
                System.out.println("Salvando usuário admin...");
                Usuario savedAdmin = usuarioRepository.save(admin);
                System.out.println("Usuário admin criado com sucesso! ID: " + savedAdmin.getId());
                System.out.println("Username: admin");
                System.out.println("Password: admin");
                System.out.println("Admin ativo: " + savedAdmin.getAtivo());
            } else {
                System.out.println("Usuário admin já existe");
                Usuario admin = adminOptional.get();
                System.out.println("ID do admin: " + admin.getId());
                System.out.println("Admin ativo: " + admin.getAtivo());
                System.out.println("Email do admin: " + admin.getEmail());
                
                // Verificar se a senha está correta
                boolean passwordMatches = passwordEncoder.matches("admin", admin.getPassword());
                System.out.println("Senha 'admin' corresponde: " + passwordMatches);
            }
        } catch (Exception e) {
            System.err.println("Erro no DataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== DataInitializer concluído ===");
    }
} 