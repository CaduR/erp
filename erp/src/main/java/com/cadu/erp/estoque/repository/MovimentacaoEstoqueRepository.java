package com.cadu.erp.estoque.repository;

import com.cadu.erp.estoque.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, UUID> {
    List<MovimentacaoEstoque> findByProdutoIdOrderByDataHoraAsc(UUID produtoId);
}
