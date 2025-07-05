package com.cadu.erp.vendas.service;

import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import com.cadu.erp.financeiro.model.ContaReceber;
import com.cadu.erp.financeiro.repository.ContaReceberRepository;
import com.cadu.erp.vendas.dto.*;
import com.cadu.erp.vendas.model.Cliente;
import com.cadu.erp.vendas.model.Venda;
import com.cadu.erp.vendas.model.VendaItem;
import com.cadu.erp.vendas.repository.ClienteRepository;
import com.cadu.erp.vendas.repository.VendaRepository;
import com.cadu.erp.estoque.service.MovimentacaoEstoqueService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final ContaReceberRepository contaReceberRepository;
    private final NotaFiscalService notaFiscalService;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;

    @Transactional
    public VendaResponseDto criarVenda(VendaRequestDto dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        List<VendaItem> itens = new ArrayList<>();
        BigDecimal valorTotal = BigDecimal.ZERO;
        List<String> errosEstoque = new ArrayList<>();

        for (VendaItemDto itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
            
            if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                errosEstoque.add(String.format("Produto '%s': Estoque disponível %d, quantidade solicitada %d", 
                    produto.getNome(), produto.getQuantidadeEstoque(), itemDto.getQuantidade()));
            }
        }
        
        if (!errosEstoque.isEmpty()) {
            String mensagemErro = "Estoque insuficiente para os seguintes produtos:\n" +
                String.join("\n", errosEstoque);
            throw new IllegalArgumentException(mensagemErro);
        }

        for (VendaItemDto itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
            
            // Baixa no estoque
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());
            produtoRepository.save(produto);

            VendaItem item = new VendaItem();
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());
            itens.add(item);

            valorTotal = valorTotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDto.getQuantidade())));
        }

        Venda venda = new Venda();
        venda.setCliente(cliente);
        venda.setDataVenda(LocalDateTime.now());
        venda.setValorTotal(valorTotal);
        venda.setItens(itens);
        itens.forEach(i -> i.setVenda(venda));

        Venda vendaSalva = vendaRepository.save(venda);

        // Integração Financeira: Gera conta a receber
        ContaReceber conta = new ContaReceber();
        conta.setDescricao("Conta a receber da venda " + vendaSalva.getId());
        conta.setValor(valorTotal);
        conta.setDataVencimento(LocalDate.now().plusDays(30));
        conta.setStatus(com.cadu.erp.financeiro.model.StatusContaReceber.ABERTO);
        conta.setVenda(vendaSalva);
        contaReceberRepository.save(conta);

        System.out.println("Conta a Receber gerada para a venda " + vendaSalva.getId() + " no valor de " + valorTotal);

        // Emissão de Nota Fiscal
        notaFiscalService.emitirNotaFiscal(vendaSalva);

        return toResponseDto(vendaSalva);
    }

    public Page<VendaResponseDto> listar(Pageable pageable) {
        return vendaRepository.findAll(pageable).map(this::toResponseDto);
    }

    public VendaResponseDto buscarPorId(UUID id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
        return toResponseDto(venda);
    }

    public Venda buscarVendaEntityPorId(UUID id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
    }

    @Transactional
    public VendaResponseDto atualizar(UUID id, VendaRequestDto dto) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
        
        // Implementar lógica de atualização se necessário
        // Por enquanto, retorna a venda existente
        return toResponseDto(venda);
    }

    @Transactional
    public void deletar(UUID id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
        vendaRepository.delete(venda);
    }

    public Page<VendaResponseDto> relatorioPorPeriodo(LocalDate inicio, LocalDate fim, Pageable pageable) {
        // Implementar busca por período
        // Por enquanto, retorna todas as vendas
        return vendaRepository.findAll(pageable).map(this::toResponseDto);
    }

    public List<VendaResponseDto> buscarPorCliente(UUID clienteId) {
        List<Venda> vendas = vendaRepository.findAll().stream()
            .filter(v -> v.getCliente().getId().equals(clienteId))
            .toList();
        return vendas.stream().map(this::toResponseDto).toList();
    }

    private VendaResponseDto toResponseDto(Venda venda) {
        VendaResponseDto resp = new VendaResponseDto();
        resp.setId(venda.getId());
        resp.setClienteId(venda.getCliente().getId());
        resp.setClienteNome(venda.getCliente().getNome());
        resp.setDataVenda(venda.getDataVenda());
        resp.setValorTotal(venda.getValorTotal());

        List<VendaItemDetalheDto> itensResp = new ArrayList<>();
        for (VendaItem item : venda.getItens()) {
            VendaItemDetalheDto itemResp = new VendaItemDetalheDto();
            itemResp.setProdutoId(item.getProduto().getId());
            itemResp.setProdutoNome(item.getProduto().getNome());
            itemResp.setQuantidade(item.getQuantidade());
            itemResp.setPrecoUnitario(item.getPrecoUnitario());
            itemResp.setSubtotal(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
            itensResp.add(itemResp);
        }
        resp.setItens(itensResp);

        return resp;
    }
}