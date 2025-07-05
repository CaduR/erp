package com.cadu.erp.estoque.service;

import com.cadu.erp.estoque.dto.ProdutoDto;
import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoDto criar(@Valid ProdutoDto dto) {
        if (produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new DataIntegrityViolationException("Já existe produto com esse código");
        }
        Produto produto = toEntity(dto);
        Produto salvo = produtoRepository.save(produto);
        return toDto(salvo);
    }

    public List<ProdutoDto> listar() {
        return produtoRepository.findByAtivoTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProdutoDto buscarPorId(String id) {
        Produto produto = produtoRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        return toDto(produto);
    }

    public ProdutoDto atualizar(String id, @Valid ProdutoDto dto) {
        Produto produto = produtoRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        if (!produto.getCodigo().equals(dto.getCodigo()) && produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new DataIntegrityViolationException("Já existe produto com esse código");
        }
        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setQuantidadeMinima(dto.getQuantidadeMinima());
        produto.setCategoria(dto.getCategoria());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        produto.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        Produto atualizado = produtoRepository.save(produto);
        return toDto(atualizado);
    }

    public void deletar(String id) {
        Produto produto = produtoRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    // Conversão
    private ProdutoDto toDto(Produto produto) {
        ProdutoDto dto = new ProdutoDto();
        dto.setId(produto.getId());
        dto.setCodigo(produto.getCodigo());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setQuantidadeEstoque(produto.getQuantidadeEstoque());
        dto.setQuantidadeMinima(produto.getQuantidadeMinima());
        dto.setCategoria(produto.getCategoria());
        dto.setUnidadeMedida(produto.getUnidadeMedida());
        dto.setAtivo(produto.getAtivo());
        return dto;
    }

    private Produto toEntity(ProdutoDto dto) {
        Produto produto = new Produto();
        produto.setId(dto.getId());
        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setQuantidadeMinima(dto.getQuantidadeMinima());
        produto.setCategoria(dto.getCategoria());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        produto.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        return produto;
    }
}
