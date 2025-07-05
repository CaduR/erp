package com.cadu.erp.compras.controller;

import com.cadu.erp.compras.dto.FornecedorDto;
import com.cadu.erp.compras.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<FornecedorDto> criar(@Valid @RequestBody FornecedorDto dto) {
        return ResponseEntity.ok(fornecedorService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<FornecedorDto>> listar() {
        return ResponseEntity.ok(fornecedorService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorDto> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(fornecedorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorDto> atualizar(@PathVariable UUID id, @Valid @RequestBody FornecedorDto dto) {
        return ResponseEntity.ok(fornecedorService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        fornecedorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
