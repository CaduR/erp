package com.cadu.erp.vendas.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class VendaItemDetalheDto {
    private UUID produtoId;
    private String produtoNome;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
} 