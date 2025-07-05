package com.cadu.erp.vendas.service;

import com.cadu.erp.vendas.dto.ClienteDto;
import com.cadu.erp.vendas.model.Cliente;
import com.cadu.erp.vendas.repository.ClienteRepository;
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
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteDto criar(@Valid ClienteDto dto) {
        if (clienteRepository.existsByCpf(dto.getCpf())) {
            throw new DataIntegrityViolationException("Já existe cliente com esse CPF");
        }
        Cliente cliente = toEntity(dto);
        Cliente salvo = clienteRepository.save(cliente);
        return toDto(salvo);
    }

    public List<ClienteDto> listar() {
        return clienteRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ClienteDto buscarPorId(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        return toDto(cliente);
    }

    public ClienteDto atualizar(UUID id, @Valid ClienteDto dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        if (!cliente.getCpf().equals(dto.getCpf()) && clienteRepository.existsByCpf(dto.getCpf())) {
            throw new DataIntegrityViolationException("Já existe cliente com esse CPF");
        }
        cliente.setCpf(dto.getCpf());
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        Cliente atualizado = clienteRepository.save(cliente);
        return toDto(atualizado);
    }

    public void deletar(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        clienteRepository.delete(cliente);
    }

    // Conversão
    private ClienteDto toDto(Cliente cliente) {
        ClienteDto dto = new ClienteDto();
        dto.setId(cliente.getId());
        dto.setCpf(cliente.getCpf());
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setEndereco(cliente.getEndereco());
        return dto;
    }

    private Cliente toEntity(ClienteDto dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setCpf(dto.getCpf());
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        return cliente;
    }
}
