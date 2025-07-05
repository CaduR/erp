package com.cadu.erp.estoque.service;

import com.cadu.erp.estoque.model.MovimentacaoEstoque;
import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.model.TipoMovimentacaoEstoque;
import com.cadu.erp.estoque.repository.MovimentacaoEstoqueRepository;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public MovimentacaoEstoque registrarMovimentacao(
            UUID produtoId,
            TipoMovimentacaoEstoque tipo,
            Integer quantidade,
            String referenciaOperacao,
            String observacao) {

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setDataHora(LocalDateTime.now());
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setReferenciaOperacao(referenciaOperacao);
        movimentacao.setObservacao(observacao);

        return movimentacaoEstoqueRepository.save(movimentacao);
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> buscarMovimentacoesPorProduto(UUID produtoId) {
        return movimentacaoEstoqueRepository.findByProdutoIdOrderByDataHoraAsc(produtoId);
    }
}
