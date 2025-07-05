package com.cadu.erp.financeiro.controller;

import com.cadu.erp.financeiro.dto.BalancoPatrimonialDTO;
import com.cadu.erp.financeiro.dto.DRE_DTO;
import com.cadu.erp.financeiro.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dre")
    public ResponseEntity<DRE_DTO> getDRE(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        DRE_DTO dre = reportService.gerarDRE(dataInicio, dataFim);
        return ResponseEntity.ok(dre);
    }

    @GetMapping("/balanco-patrimonial")
    public ResponseEntity<BalancoPatrimonialDTO> getBalancoPatrimonial(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataReferencia) {
        BalancoPatrimonialDTO balanco = reportService.gerarBalancoPatrimonial(dataReferencia);
        return ResponseEntity.ok(balanco);
    }
}
