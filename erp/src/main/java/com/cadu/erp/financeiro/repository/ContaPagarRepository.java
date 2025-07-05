package com.cadu.erp.financeiro.repository;

import com.cadu.erp.financeiro.model.ContaPagar;
import com.cadu.erp.financeiro.model.StatusContaPagar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface ContaPagarRepository extends JpaRepository<ContaPagar, UUID> {
    long countByStatus(StatusContaPagar status);

    @Query("SELECT SUM(c.valor) FROM ContaPagar c WHERE c.status = :status")
    Optional<BigDecimal> sumValorByStatus(StatusContaPagar status);
}
