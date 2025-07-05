package com.cadu.erp.compras.service;

import com.cadu.erp.compras.model.PedidoCompra;
import com.cadu.erp.compras.model.PedidoCompraItem;
import com.cadu.erp.compras.model.StatusPedidoCompra;
import com.cadu.erp.compras.repository.FornecedorRepository;
import com.cadu.erp.compras.repository.PedidoCompraRepository;
import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import com.cadu.erp.estoque.service.MovimentacaoEstoqueService;
import com.cadu.erp.financeiro.model.ContaPagar;
import com.cadu.erp.financeiro.model.StatusContaPagar;
import com.cadu.erp.financeiro.repository.ContaPagarRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final ContaPagarRepository contaPagarRepository;

    @Transactional
    public PedidoCompra criarPedidoCompra(PedidoCompra pedido) {
        pedido.setDataPedido(LocalDate.now());
        pedido.setStatus(StatusPedidoCompra.PENDENTE);
        pedido.setValorTotal(calcularValorTotal(pedido.getItens()));
        pedido.getItens().forEach(item -> item.setPedidoCompra(pedido));
        return pedidoCompraRepository.save(pedido);
    }

    public List<PedidoCompra> listarPedidosCompra() {
        return pedidoCompraRepository.findAll();
    }

    public PedidoCompra buscarPedidoCompraPorId(UUID id) {
        return pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));
    }

    @Transactional
    public PedidoCompra atualizarPedidoCompra(UUID id, PedidoCompra pedidoAtualizado) {
        PedidoCompra pedidoExistente = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));

        pedidoExistente.setFornecedor(pedidoAtualizado.getFornecedor());
        pedidoExistente.setDataPedido(pedidoAtualizado.getDataPedido());
        pedidoExistente.setStatus(pedidoAtualizado.getStatus());
        // Atualizar itens e recalcular valor total
        pedidoExistente.setItens(pedidoAtualizado.getItens());
        pedidoExistente.getItens().forEach(item -> item.setPedidoCompra(pedidoExistente));
        pedidoExistente.setValorTotal(calcularValorTotal(pedidoAtualizado.getItens()));

        return pedidoCompraRepository.save(pedidoExistente);
    }

    @Transactional
    public void deletarPedidoCompra(UUID id) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));
        pedidoCompraRepository.delete(pedido);
    }

    @Transactional
    public PedidoCompra aprovarPedido(UUID id) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));
        pedido.setStatus(StatusPedidoCompra.APROVADO);
        return pedidoCompraRepository.save(pedido);
    }

    @Transactional
    public PedidoCompra cancelarPedido(UUID id) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));
        pedido.setStatus(StatusPedidoCompra.CANCELADO);
        return pedidoCompraRepository.save(pedido);
    }

    @Transactional
    public PedidoCompra receberMercadorias(UUID pedidoId, List<PedidoCompraItem> itensRecebidos) {
        PedidoCompra pedido = pedidoCompraRepository.findById(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido de Compra não encontrado"));

        // Atualizar estoque e registrar movimentações
        for (PedidoCompraItem itemRecebido : itensRecebidos) {
            Produto produto = produtoRepository.findById(itemRecebido.getProduto().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
            
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + itemRecebido.getQuantidade());
            produtoRepository.save(produto);

            movimentacaoEstoqueService.registrarMovimentacao(
                produto.getId(),
                com.cadu.erp.estoque.model.TipoMovimentacaoEstoque.ENTRADA_COMPRA,
                itemRecebido.getQuantidade(),
                "Pedido de Compra " + pedido.getId(),
                "Entrada por recebimento de compra");
        }

        // Atualizar status do pedido (simplificado para MVP)
        pedido.setStatus(StatusPedidoCompra.RECEBIDO_TOTAL);
        
        // Gerar conta a pagar (simplificado para MVP)
        ContaPagar contaPagar = new ContaPagar();
        contaPagar.setDescricao("Conta a Pagar do Pedido de Compra " + pedido.getId());
        contaPagar.setValor(pedido.getValorTotal());
        contaPagar.setDataVencimento(LocalDate.now().plusDays(30)); // Vencimento em 30 dias
        contaPagar.setStatus(StatusContaPagar.PENDENTE);
        contaPagar.setFornecedor(pedido.getFornecedor());
        contaPagarRepository.save(contaPagar);

        return pedidoCompraRepository.save(pedido);
    }

    private BigDecimal calcularValorTotal(List<PedidoCompraItem> itens) {
        return itens.stream()
                .map(item -> item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
