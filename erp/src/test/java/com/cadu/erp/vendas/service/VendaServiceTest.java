package com.cadu.erp.vendas.service;

import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import com.cadu.erp.financeiro.model.ContaReceber;
import com.cadu.erp.financeiro.model.StatusContaReceber;
import com.cadu.erp.financeiro.repository.ContaReceberRepository;
import com.cadu.erp.vendas.dto.VendaItemDto;
import com.cadu.erp.vendas.dto.VendaRequestDto;
import com.cadu.erp.vendas.dto.VendaResponseDto;
import com.cadu.erp.vendas.model.Cliente;
import com.cadu.erp.vendas.model.Venda;
import com.cadu.erp.vendas.model.VendaItem;
import com.cadu.erp.vendas.repository.ClienteRepository;
import com.cadu.erp.vendas.repository.VendaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.cadu.erp.estoque.service.MovimentacaoEstoqueService;
import com.cadu.erp.vendas.service.NotaFiscalService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendaServiceTest {

    @Mock
    private VendaRepository vendaRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ContaReceberRepository contaReceberRepository;

    @Mock
    private NotaFiscalService notaFiscalService;

    @Mock
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    @InjectMocks
    private VendaService vendaService;

    private Cliente cliente;
    private Produto produto;
    private VendaRequestDto vendaRequest;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setId(UUID.randomUUID());
        cliente.setNome("João Silva");
        cliente.setCpf("123.456.789-00");

        produto = new Produto();
        produto.setId(UUID.randomUUID());
        produto.setNome("Produto Teste");
        produto.setPreco(new BigDecimal("10.00"));
        produto.setQuantidadeEstoque(100);
        produto.setQuantidadeMinima(10);
        produto.setCategoria("Categoria Teste");
        produto.setUnidadeMedida("UN");
        produto.setAtivo(true);

        VendaItemDto itemDto = new VendaItemDto();
        itemDto.setProdutoId(produto.getId());
        itemDto.setQuantidade(5);

        vendaRequest = new VendaRequestDto();
        vendaRequest.setClienteId(cliente.getId());
        vendaRequest.setItens(Arrays.asList(itemDto));
    }

    @Test
    void criarVenda_ComDadosValidos_DeveCriarVendaComSucesso() {
        // Arrange
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> {
            Venda venda = invocation.getArgument(0);
            venda.setId(UUID.randomUUID());
            return venda;
        });
        when(contaReceberRepository.save(any(ContaReceber.class))).thenReturn(new ContaReceber());

        // Act
        VendaResponseDto result = vendaService.criarVenda(vendaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(cliente.getNome(), result.getClienteNome());
        assertEquals(new BigDecimal("50.00"), result.getValorTotal());
        assertEquals(1, result.getItens().size());

        verify(produtoRepository).save(any(Produto.class));
        verify(contaReceberRepository).save(any(ContaReceber.class));
    }

    @Test
    void criarVenda_ComClienteInexistente_DeveLancarExcecao() {
        // Arrange
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            vendaService.criarVenda(vendaRequest);
        });

        verify(vendaRepository, never()).save(any());
    }

    @Test
    void criarVenda_ComProdutoInexistente_DeveLancarExcecao() {
        // Arrange
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            vendaService.criarVenda(vendaRequest);
        });

        verify(vendaRepository, never()).save(any());
    }

    @Test
    void criarVenda_ComEstoqueInsuficiente_DeveLancarExcecao() {
        // Arrange
        produto.setQuantidadeEstoque(2); // Estoque menor que a quantidade solicitada (5)
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            vendaService.criarVenda(vendaRequest);
        });

        verify(vendaRepository, never()).save(any());
    }

    @Test
    void criarVenda_DeveBaixarEstoqueCorretamente() {
        // Arrange
        int estoqueInicial = 100;
        int quantidadeVendida = 5;
        produto.setQuantidadeEstoque(estoqueInicial);

        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> {
            Venda venda = invocation.getArgument(0);
            venda.setId(UUID.randomUUID());
            return venda;
        });
        when(contaReceberRepository.save(any(ContaReceber.class))).thenReturn(new ContaReceber());

        // Act
        vendaService.criarVenda(vendaRequest);

        // Assert
        verify(produtoRepository).save(argThat(produtoSalvo ->
            produtoSalvo.getQuantidadeEstoque() == estoqueInicial - quantidadeVendida
        ));
    }

    @Test
    void criarVenda_DeveCriarContaReceber() {
        // Arrange
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> {
            Venda venda = invocation.getArgument(0);
            venda.setId(UUID.randomUUID());
            return venda;
        });
        when(contaReceberRepository.save(any(ContaReceber.class))).thenAnswer(invocation -> {
            ContaReceber conta = invocation.getArgument(0);
            conta.setCliente(cliente);
            return conta;
        });

        // Act
        vendaService.criarVenda(vendaRequest);

        // Assert
        verify(contaReceberRepository).save(argThat(conta ->
            conta.getCliente().equals(cliente) &&
            conta.getStatus() == StatusContaReceber.ABERTO &&
            conta.getValor().equals(new BigDecimal("50.00"))
        ));
    }
} 