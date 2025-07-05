package com.cadu.erp.config.service;

import com.cadu.erp.config.ConfiguracaoEmpresaRepository;
import com.cadu.erp.config.model.ConfiguracaoEmpresa;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracaoEmpresaService {

    private final ConfiguracaoEmpresaRepository repository;

    public ConfiguracaoEmpresaService(ConfiguracaoEmpresaRepository repository) {
        this.repository = repository;
    }

    public ConfiguracaoEmpresa salvar(ConfiguracaoEmpresa configuracao) {
        // Garante que sempre haverá apenas uma configuração
        List<ConfiguracaoEmpresa> configsExistentes = repository.findAll();
        if (!configsExistentes.isEmpty()) {
            configuracao.setId(configsExistentes.get(0).getId());
        }
        return repository.save(configuracao);
    }

    public Optional<ConfiguracaoEmpresa> buscar() {
        List<ConfiguracaoEmpresa> configs = repository.findAll();
        return configs.isEmpty() ? Optional.empty() : Optional.of(configs.get(0));
    }
}
