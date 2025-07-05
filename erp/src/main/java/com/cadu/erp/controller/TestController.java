package com.cadu.erp.controller;

import com.cadu.erp.security.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TestController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "ERP API está funcionando corretamente!");
        return response;
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", "ERP System");
        info.put("version", "1.0.0");
        info.put("description", "Sistema ERP com módulos de estoque, vendas, compras e financeiro");
        info.put("modules", new String[]{"estoque", "vendas", "compras", "financeiro"});
        return info;
    }

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> testDatabase() {
        Map<String, Object> response = new HashMap<>();
        try {
            long userCount = usuarioRepository.count();
            response.put("status", "OK");
            response.put("message", "Conexão com banco OK");
            response.put("userCount", userCount);
            
            var adminUser = usuarioRepository.findByUsername("admin");
            if (adminUser.isPresent()) {
                response.put("adminExists", true);
                response.put("adminActive", adminUser.get().getAtivo());
            } else {
                response.put("adminExists", false);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Erro na conexão com banco");
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 