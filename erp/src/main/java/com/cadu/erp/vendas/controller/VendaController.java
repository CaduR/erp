package com.cadu.erp.vendas.controller;

import com.cadu.erp.vendas.dto.VendaRequestDto;
import com.cadu.erp.vendas.dto.VendaResponseDto;
import com.cadu.erp.vendas.service.VendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VendaController {

    private final VendaService vendaService;

    @GetMapping
    public ResponseEntity<Page<VendaResponseDto>> listar(Pageable pageable) {
        Page<VendaResponseDto> vendas = vendaService.listar(pageable);
        return ResponseEntity.ok(vendas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponseDto> buscarPorId(@PathVariable UUID id) {
        VendaResponseDto response = vendaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<VendaResponseDto> criar(@Valid @RequestBody VendaRequestDto dto) {
        VendaResponseDto response = vendaService.criarVenda(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendaResponseDto> atualizar(@PathVariable UUID id, @Valid @RequestBody VendaRequestDto dto) {
        try {
            VendaResponseDto vendaAtualizada = vendaService.atualizar(id, dto);
            return ResponseEntity.ok(vendaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        vendaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorio")
    public ResponseEntity<Page<VendaResponseDto>> relatorio(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            Pageable pageable) {
        Page<VendaResponseDto> vendas = vendaService.relatorioPorPeriodo(dataInicio, dataFim, pageable);
        return ResponseEntity.ok(vendas);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<VendaResponseDto>> buscarPorCliente(@PathVariable UUID clienteId) {
        List<VendaResponseDto> vendas = vendaService.buscarPorCliente(clienteId);
        return ResponseEntity.ok(vendas);
    }
}
