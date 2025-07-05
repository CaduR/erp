package com.cadu.erp.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalProdutos;
    private long produtosEstoqueBaixo;
    private long totalClientes;
    private long totalFornecedores;
    private long contasReceberAbertas;
    private BigDecimal valorContasReceberAbertas;
    private long contasPagarAbertas;
    private BigDecimal valorContasPagarAbertas;
    private BigDecimal vendasHoje;
    private BigDecimal vendasMes;
}
