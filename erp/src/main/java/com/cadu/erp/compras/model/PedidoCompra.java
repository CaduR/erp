package com.cadu.erp.compras.model;

import com.cadu.erp.compras.model.Fornecedor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class PedidoCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    private LocalDate dataPedido;

    @Enumerated(EnumType.STRING)
    private StatusPedidoCompra status;

    private BigDecimal valorTotal;

    @OneToMany(mappedBy = "pedidoCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoCompraItem> itens;
}
