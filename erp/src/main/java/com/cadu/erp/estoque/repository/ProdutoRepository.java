package com.cadu.erp.estoque.repository;

import com.cadu.erp.estoque.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    long count();

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.quantidadeEstoque <= p.quantidadeMinima AND p.ativo = true")
    long countByQuantidadeEstoqueLessThanEqualQuantidadeMinima();
    
    Optional<Produto> findByCodigo(String codigo);
    
    List<Produto> findByAtivoTrue();
    
    List<Produto> findByCategoria(String categoria);
    
    @Query("SELECT p FROM Produto p WHERE p.quantidadeEstoque <= p.quantidadeMinima AND p.ativo = true")
    List<Produto> findProdutosComEstoqueBaixo();
    
    @Query("SELECT p FROM Produto p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%')) OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Produto> findByNomeOuCodigoContaining(@Param("nome") String nome);
    
    boolean existsByCodigo(String codigo);
    
    long countByAtivoTrue();
} 