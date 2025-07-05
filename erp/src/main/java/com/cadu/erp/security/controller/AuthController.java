package com.cadu.erp.security.controller;

import com.cadu.erp.security.dto.LoginRequest;
import com.cadu.erp.security.dto.LoginResponse;
import com.cadu.erp.security.JwtUtil;
import com.cadu.erp.security.UsuarioRepository;
import com.cadu.erp.security.model.Usuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/check-admin")
    public ResponseEntity<?> checkAdmin() {
        try {
            var adminUser = usuarioRepository.findByUsername("admin");
            if (adminUser.isPresent()) {
                Usuario admin = adminUser.get();
                Map<String, Object> response = new HashMap<>();
                response.put("exists", true);
                response.put("username", admin.getUsername());
                response.put("ativo", admin.getAtivo());
                response.put("email", admin.getEmail());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("exists", false);
                response.put("message", "Usuário admin não encontrado");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao verificar usuário admin");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Tentativa de login para usuário: {}", loginRequest.getUsername());
        
        try {
            log.info("Iniciando autenticação...");
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), 
                    loginRequest.getPassword()
                )
            );
            log.info("Autenticação bem-sucedida para usuário: {}", loginRequest.getUsername());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("Gerando token JWT...");
            String token = jwtUtil.generateToken(userDetails);
            log.info("Token JWT gerado com sucesso");

            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setExpiresIn(3600L); // 1 hora
            response.setUsername(userDetails.getUsername());

            log.info("Login realizado com sucesso para usuário: {}", userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.warn("Credenciais inválidas para usuário: {}", loginRequest.getUsername());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Credenciais inválidas");
            errorResponse.put("message", "Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("Erro interno durante login para usuário: {}", loginRequest.getUsername(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro interno");
            errorResponse.put("message", "Ocorreu um erro durante o login. Tente novamente mais tarde.");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            String username = jwtUtil.extractUsername(token);
            
            // Aqui você poderia buscar o usuário no banco e validar se ainda está ativo
            // Por simplicidade, vamos apenas gerar um novo token
            
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password("")
                .authorities("ROLE_USER")
                .build();
            
            String newToken = jwtUtil.generateToken(userDetails);
            
            LoginResponse response = new LoginResponse();
            response.setToken(newToken);
            response.setExpiresIn(3600L);
            response.setUsername(username);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 