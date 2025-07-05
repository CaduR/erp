package com.cadu.erp.compras.repository;

import com.cadu.erp.compras.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FornecedorRepository extends JpaRepository<Fornecedor, UUID> {
    long count();
    boolean existsByCnpj(String cnpj);
}

