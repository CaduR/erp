package com.cadu.erp.financeiro.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DRE_DTO {
    private LocalDate dataInicio;
    private LocalDate dataFim;

    // Receitas
    private BigDecimal receitaBrutaVendas;
    private BigDecimal deducoesVendas; // Devoluções, abatimentos
    private BigDecimal receitaLiquidaVendas;

    // Custos
    private BigDecimal custoMercadoriasVendidas; // CMV

    // Lucro Bruto
    private BigDecimal lucroBruto;

    // Despesas Operacionais
    private BigDecimal despesasComVendas;
    private BigDecimal despesasAdministrativas;
    private BigDecimal despesasFinanceiras;
    private BigDecimal outrasDespesasOperacionais;
    private BigDecimal totalDespesasOperacionais;

    // Lucro/Prejuízo Operacional
    private BigDecimal lucroPrejuizoOperacional;

    // Receitas e Despesas Não Operacionais
    private BigDecimal receitasNaoOperacionais;
    private BigDecimal despesasNaoOperacionais;

    // Lucro/Prejuízo Antes do IR e CSLL
    private BigDecimal lucroPrejuizoAntesIRCSLL;

    // Provisões para IR e CSLL
    private BigDecimal impostoRenda;
    private BigDecimal contribuicaoSocial;

    // Lucro Líquido do Exercício
    private BigDecimal lucroLiquidoExercicio;
}
