package com.cadu.erp.financeiro.dto;

import com.cadu.erp.financeiro.model.StatusContaReceber;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ContaReceberDto {
    private UUID id;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    @NotNull(message = "Data de vencimento é obrigatória")
    private LocalDate dataVencimento;

    private LocalDate dataPagamento;

    @NotNull(message = "Status é obrigatório")
    private StatusContaReceber status;

    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;

    private String clienteNome;

    private UUID vendaId;
} 