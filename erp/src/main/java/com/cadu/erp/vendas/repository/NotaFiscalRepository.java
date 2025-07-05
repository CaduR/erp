package com.cadu.erp.vendas.repository;

import com.cadu.erp.vendas.model.NotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, UUID> {
    Optional<NotaFiscal> findByVendaId(UUID vendaId);
}
