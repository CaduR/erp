package com.cadu.erp.vendas.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;

@Data
public class VendaRequestDto {
    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;

    @NotEmpty(message = "A venda deve ter pelo menos um item")
    @Valid
    private List<VendaItemDto> itens;

    // getters e setters

    public UUID getClienteId() {
        return clienteId;
    }

    public void setClienteId(UUID clienteId) {
        this.clienteId = clienteId;
    }

    public List<VendaItemDto> getItens() {
        return itens;
    }

    public void setItens(List<VendaItemDto> itens) {
        this.itens = itens;
    }
}
