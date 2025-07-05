package com.cadu.erp.estoque.service;

import com.cadu.erp.estoque.dto.ProdutoDto;
import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produto;
    private ProdutoDto produtoDto;

    @BeforeEach
    void setUp() {
        produto = new Produto();
        produto.setId(UUID.randomUUID());
        produto.setNome("Produto Teste");
        produto.setCodigo("PROD001");
        produto.setPreco(new BigDecimal("10.00"));
        produto.setQuantidadeEstoque(100);
        produto.setQuantidadeMinima(10);
        produto.setCategoria("Categoria Teste");
        produto.setUnidadeMedida("UN");
        produto.setAtivo(true);

        produtoDto = new ProdutoDto();
        produtoDto.setId(produto.getId());
        produtoDto.setNome("Produto Teste");
        produtoDto.setCodigo("PROD001");
        produtoDto.setPreco(new BigDecimal("10.00"));
        produtoDto.setQuantidadeEstoque(100);
        produtoDto.setQuantidadeMinima(10);
        produtoDto.setCategoria("Categoria Teste");
        produtoDto.setUnidadeMedida("UN");
        produtoDto.setAtivo(true);
    }

    @Test
    void listar_DeveRetornarListaDeProdutos() {
        // Arrange
        List<Produto> produtos = Arrays.asList(produto);
        when(produtoRepository.findByAtivoTrue()).thenReturn(produtos);

        // Act
        List<ProdutoDto> result = produtoService.listar();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(produto.getNome(), result.get(0).getNome());
    }

    @Test
    void buscarPorId_ComIdValido_DeveRetornarProduto() {
        // Arrange
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));

        // Act
        ProdutoDto result = produtoService.buscarPorId(produto.getId().toString());

        // Assert
        assertNotNull(result);
        assertEquals(produto.getNome(), result.getNome());
    }

    @Test
    void buscarPorId_ComIdInvalido_DeveRetornarVazio() {
        // Arrange
        UUID idInvalido = UUID.randomUUID();
        when(produtoRepository.findById(idInvalido)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> produtoService.buscarPorId(idInvalido.toString()));
    }

    @Test
    void criar_ComDadosValidos_DeveCriarProduto() {
        // Arrange
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        // Act
        ProdutoDto result = produtoService.criar(produtoDto);

        // Assert
        assertNotNull(result);
        assertEquals(produto.getNome(), result.getNome());
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void atualizar_ComDadosValidos_DeveAtualizarProduto() {
        // Arrange
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        produtoDto.setNome("Produto Atualizado");

        // Act
        ProdutoDto result = produtoService.atualizar(produto.getId().toString(), produtoDto);

        // Assert
        assertNotNull(result);
        assertEquals("Produto Atualizado", result.getNome());
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void atualizar_ComIdInexistente_DeveLancarExcecao() {
        // Arrange
        UUID idInvalido = UUID.randomUUID();
        when(produtoRepository.findById(idInvalido)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> produtoService.atualizar(idInvalido.toString(), produtoDto));
        verify(produtoRepository, never()).save(any());
    }

    @Test
    void deletar_ComIdValido_DeveDeletarProduto() {
        // Arrange
        when(produtoRepository.findById(produto.getId())).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        // Act
        produtoService.deletar(produto.getId().toString());

        // Assert
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void deletar_ComIdInexistente_DeveLancarExcecao() {
        // Arrange
        UUID idInvalido = UUID.randomUUID();
        when(produtoRepository.findById(idInvalido)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> produtoService.deletar(idInvalido.toString()));
        verify(produtoRepository, never()).save(any());
    }
} 