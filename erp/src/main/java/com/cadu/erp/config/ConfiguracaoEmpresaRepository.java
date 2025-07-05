package com.cadu.erp.config;

import com.cadu.erp.config.model.ConfiguracaoEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoEmpresaRepository extends JpaRepository<ConfiguracaoEmpresa, Long> {
}
