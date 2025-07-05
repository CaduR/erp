package com.cadu.erp.config.controller;

import com.cadu.erp.config.model.ConfiguracaoEmpresa;
import com.cadu.erp.config.service.ConfiguracaoEmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracao-empresa")
public class ConfiguracaoEmpresaController {

    private final ConfiguracaoEmpresaService service;

    public ConfiguracaoEmpresaController(ConfiguracaoEmpresaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ConfiguracaoEmpresa> buscarConfiguracao() {
        return service.buscar()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<ConfiguracaoEmpresa> salvarConfiguracao(@RequestBody ConfiguracaoEmpresa configuracao) {
        ConfiguracaoEmpresa savedConfig = service.salvar(configuracao);
        return ResponseEntity.ok(savedConfig);
    }
}
