package com.cadu.erp.financeiro.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class BalancoPatrimonialDTO {
    private LocalDate dataReferencia;

    // Ativo
    private BigDecimal ativoCirculante;
    private BigDecimal ativoNaoCirculante;
    private BigDecimal totalAtivo;

    // Passivo
    private BigDecimal passivoCirculante;
    private BigDecimal passivoNaoCirculante;
    private BigDecimal totalPassivo;

    // Patrimônio Líquido
    private BigDecimal patrimonioLiquido;
    private BigDecimal totalPassivoPatrimonioLiquido;
}
