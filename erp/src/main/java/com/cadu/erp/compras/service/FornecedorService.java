package com.cadu.erp.compras.service;

import com.cadu.erp.compras.dto.FornecedorDto;
import com.cadu.erp.compras.model.Fornecedor;
import com.cadu.erp.compras.repository.FornecedorRepository;
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
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorDto criar(@Valid FornecedorDto dto) {
        if (fornecedorRepository.existsByCnpj(dto.getCnpj())) {
            throw new DataIntegrityViolationException("Já existe fornecedor com esse CNPJ");
        }
        Fornecedor fornecedor = toEntity(dto);
        Fornecedor salvo = fornecedorRepository.save(fornecedor);
        return toDto(salvo);
    }

    public List<FornecedorDto> listar() {
        return fornecedorRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public FornecedorDto buscarPorId(UUID id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor não encontrado"));
        return toDto(fornecedor);
    }

    public FornecedorDto atualizar(UUID id, @Valid FornecedorDto dto) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor não encontrado"));
        if (!fornecedor.getCnpj().equals(dto.getCnpj()) && fornecedorRepository.existsByCnpj(dto.getCnpj())) {
            throw new DataIntegrityViolationException("Já existe fornecedor com esse CNPJ");
        }
        fornecedor.setCnpj(dto.getCnpj());
        fornecedor.setRazaoSocial(dto.getRazaoSocial());
        fornecedor.setNomeFantasia(dto.getNomeFantasia());
        fornecedor.setEndereco(dto.getEndereco());
        fornecedor.setNome(dto.getRazaoSocial()); // Usar razão social como nome
        Fornecedor atualizado = fornecedorRepository.save(fornecedor);
        return toDto(atualizado);
    }

    public void deletar(UUID id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor não encontrado"));
        fornecedorRepository.delete(fornecedor);
    }

    // Conversão
    private FornecedorDto toDto(Fornecedor fornecedor) {
        FornecedorDto dto = new FornecedorDto();
        dto.setId(fornecedor.getId());
        dto.setCnpj(fornecedor.getCnpj());
        dto.setRazaoSocial(fornecedor.getRazaoSocial());
        dto.setNomeFantasia(fornecedor.getNomeFantasia());
        dto.setEndereco(fornecedor.getEndereco());
        return dto;
    }

    private Fornecedor toEntity(FornecedorDto dto) {
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.setId(dto.getId());
        fornecedor.setCnpj(dto.getCnpj());
        fornecedor.setRazaoSocial(dto.getRazaoSocial());
        fornecedor.setNomeFantasia(dto.getNomeFantasia());
        fornecedor.setEndereco(dto.getEndereco());
        
        // Preencher campos obrigatórios que não estão no DTO
        fornecedor.setNome(dto.getRazaoSocial()); // Usar razão social como nome
        fornecedor.setAtivo(true); // Por padrão, fornecedor é ativo
        
        return fornecedor;
    }
}
