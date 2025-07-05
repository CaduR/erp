package com.cadu.erp.security;

import com.cadu.erp.security.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
} 