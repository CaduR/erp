package com.cadu.erp.compras.repository;

import com.cadu.erp.compras.model.PedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, UUID> {
}
