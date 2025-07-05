package com.cadu.erp.financeiro.repository;

import com.cadu.erp.financeiro.model.ContaReceber;
import com.cadu.erp.financeiro.model.StatusContaReceber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContaReceberRepository extends JpaRepository<ContaReceber, UUID> {
    long countByStatus(StatusContaReceber status);

    @Query("SELECT SUM(c.valor) FROM ContaReceber c WHERE c.status = :status")
    Optional<BigDecimal> sumValorByStatus(StatusContaReceber status);

    List<ContaReceber> findByStatus(StatusContaReceber status);
    List<ContaReceber> findByClienteId(UUID clienteId);
}
