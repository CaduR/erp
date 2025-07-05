package com.cadu.erp.vendas.repository;

import com.cadu.erp.vendas.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface VendaRepository extends JpaRepository<Venda, UUID> {
    @Query("SELECT SUM(v.valorTotal) FROM Venda v WHERE v.dataVenda BETWEEN :dataInicio AND :dataFim")
    Optional<BigDecimal> sumValorTotalByDataVendaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
}

