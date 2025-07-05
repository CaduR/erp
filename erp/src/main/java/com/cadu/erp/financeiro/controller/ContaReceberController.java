package com.cadu.erp.financeiro.controller;

import com.cadu.erp.financeiro.dto.ContaReceberDto;
import com.cadu.erp.financeiro.model.StatusContaReceber;
import com.cadu.erp.financeiro.service.ContaReceberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contas-receber")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ContaReceberController {

    private final ContaReceberService contaReceberService;

    @GetMapping
    public ResponseEntity<List<ContaReceberDto>> listar() {
        List<ContaReceberDto> contas = contaReceberService.listar();
        return ResponseEntity.ok(contas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaReceberDto> buscarPorId(@PathVariable UUID id) {
        return contaReceberService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ContaReceberDto> criar(@Valid @RequestBody ContaReceberDto dto) {
        ContaReceberDto contaCriada = contaReceberService.criar(dto);
        return ResponseEntity.ok(contaCriada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContaReceberDto> atualizar(@PathVariable UUID id, @Valid @RequestBody ContaReceberDto dto) {
        ContaReceberDto atualizado = contaReceberService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        contaReceberService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<ContaReceberDto> marcarComoPago(@PathVariable UUID id) {
        ContaReceberDto contaPago = contaReceberService.marcarComoPago(id);
        return ResponseEntity.ok(contaPago);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ContaReceberDto>> buscarPorStatus(@PathVariable StatusContaReceber status) {
        List<ContaReceberDto> contas = contaReceberService.buscarPorStatus(status);
        return ResponseEntity.ok(contas);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ContaReceberDto>> buscarPorCliente(@PathVariable UUID clienteId) {
        List<ContaReceberDto> contas = contaReceberService.buscarPorCliente(clienteId);
        return ResponseEntity.ok(contas);
    }
}
