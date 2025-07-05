package com.cadu.erp.vendas.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class VendaResponseDto {
    private UUID id;
    private UUID clienteId;
    private String clienteNome;
    private LocalDateTime dataVenda;
    private BigDecimal valorTotal;
    private List<VendaItemDetalheDto> itens;
}
