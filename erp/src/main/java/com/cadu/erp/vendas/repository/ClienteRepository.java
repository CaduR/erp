package com.cadu.erp.vendas.repository;

import com.cadu.erp.vendas.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    long count();
    boolean existsByCpf(String cpf);
}

