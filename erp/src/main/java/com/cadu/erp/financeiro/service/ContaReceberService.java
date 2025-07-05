package com.cadu.erp.financeiro.service;

import com.cadu.erp.financeiro.dto.ContaReceberDto;
import com.cadu.erp.financeiro.model.ContaReceber;
import com.cadu.erp.financeiro.model.StatusContaReceber;
import com.cadu.erp.financeiro.repository.ContaReceberRepository;
import com.cadu.erp.vendas.model.Cliente;
import com.cadu.erp.vendas.repository.ClienteRepository;
import com.cadu.erp.vendas.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContaReceberService {
    private final ContaReceberRepository contaReceberRepository;
    private final ClienteRepository clienteRepository;
    private final VendaRepository vendaRepository;

    public List<ContaReceberDto> listar() {
        return contaReceberRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<ContaReceberDto> listarPaginado(Pageable pageable) {
        return contaReceberRepository.findAll(pageable).map(this::toDto);
    }

    public Optional<ContaReceberDto> buscarPorId(UUID id) {
        return contaReceberRepository.findById(id).map(this::toDto);
    }

    @Transactional
    public ContaReceberDto criar(ContaReceberDto dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        ContaReceber contaReceber = new ContaReceber();
        contaReceber.setDescricao(dto.getDescricao());
        contaReceber.setValor(dto.getValor());
        contaReceber.setDataVencimento(dto.getDataVencimento());
        contaReceber.setStatus(dto.getStatus());
        contaReceber.setCliente(cliente);
        if (dto.getVendaId() != null) {
            contaReceber.setVenda(vendaRepository.findById(dto.getVendaId()).orElse(null));
        }
        ContaReceber saved = contaReceberRepository.save(contaReceber);
        return toDto(saved);
    }

    @Transactional
    public ContaReceberDto atualizar(UUID id, ContaReceberDto dto) {
        ContaReceber contaReceber = contaReceberRepository.findById(id).orElseThrow(() -> new RuntimeException("Conta a receber não encontrada"));
        if (contaReceber.getStatus() == StatusContaReceber.PAGO) {
            throw new RuntimeException("Não é possível alterar uma conta já paga");
        }
        Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        contaReceber.setDescricao(dto.getDescricao());
        contaReceber.setValor(dto.getValor());
        contaReceber.setDataVencimento(dto.getDataVencimento());
        contaReceber.setStatus(dto.getStatus());
        contaReceber.setCliente(cliente);
        if (dto.getVendaId() != null) {
            contaReceber.setVenda(vendaRepository.findById(dto.getVendaId()).orElse(null));
        }
        ContaReceber saved = contaReceberRepository.save(contaReceber);
        return toDto(saved);
    }

    @Transactional
    public void deletar(UUID id) {
        ContaReceber contaReceber = contaReceberRepository.findById(id).orElseThrow(() -> new RuntimeException("Conta a receber não encontrada"));
        if (contaReceber.getStatus() == StatusContaReceber.PAGO) {
            throw new RuntimeException("Não é possível excluir uma conta já paga");
        }
        contaReceberRepository.delete(contaReceber);
    }

    @Transactional
    public ContaReceberDto marcarComoPago(UUID id) {
        ContaReceber contaReceber = contaReceberRepository.findById(id).orElseThrow(() -> new RuntimeException("Conta a receber não encontrada"));
        if (contaReceber.getStatus() == StatusContaReceber.PAGO) {
            throw new RuntimeException("Conta já está paga");
        }
        contaReceber.setStatus(StatusContaReceber.PAGO);
        contaReceber.setDataPagamento(LocalDate.now());
        ContaReceber saved = contaReceberRepository.save(contaReceber);
        return toDto(saved);
    }

    public List<ContaReceberDto> buscarPorStatus(StatusContaReceber status) {
        return contaReceberRepository.findByStatus(status).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ContaReceberDto> buscarPorCliente(UUID clienteId) {
        return contaReceberRepository.findByClienteId(clienteId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private ContaReceberDto toDto(ContaReceber contaReceber) {
        ContaReceberDto dto = new ContaReceberDto();
        dto.setId(contaReceber.getId());
        dto.setDescricao(contaReceber.getDescricao());
        dto.setValor(contaReceber.getValor());
        dto.setDataVencimento(contaReceber.getDataVencimento());
        dto.setDataPagamento(contaReceber.getDataPagamento());
        dto.setStatus(contaReceber.getStatus());
        dto.setClienteId(contaReceber.getCliente().getId());
        dto.setClienteNome(contaReceber.getCliente().getNome());
        if (contaReceber.getVenda() != null) {
            dto.setVendaId(contaReceber.getVenda().getId());
        }
        return dto;
    }
} 