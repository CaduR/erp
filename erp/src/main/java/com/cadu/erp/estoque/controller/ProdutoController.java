package com.cadu.erp.estoque.controller;

import com.cadu.erp.estoque.dto.ProdutoDto;
import com.cadu.erp.estoque.service.ProdutoService;
import com.cadu.erp.estoque.services.ProdutoImportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoImportService produtoImportService;

    @PostMapping
    public ResponseEntity<ProdutoDto> criar(@Valid @RequestBody ProdutoDto dto) {
        return ResponseEntity.ok(produtoService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProdutoDto>> listar() {
        return ResponseEntity.ok(produtoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDto> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDto> atualizar(@PathVariable String id, @Valid @RequestBody ProdutoDto dto) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<String> importProdutos(@RequestParam("file") MultipartFile file) {
        produtoImportService.importProdutosFromCsv(file);
        return ResponseEntity.ok("Produtos importados com sucesso!");
    }
} 