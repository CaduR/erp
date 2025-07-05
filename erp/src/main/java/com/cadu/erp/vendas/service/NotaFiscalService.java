package com.cadu.erp.vendas.service;

import com.cadu.erp.vendas.model.NotaFiscal;
import com.cadu.erp.vendas.model.StatusNotaFiscal;
import com.cadu.erp.vendas.model.Venda;
import com.cadu.erp.vendas.repository.NotaFiscalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class NotaFiscalService {

    private final NotaFiscalRepository notaFiscalRepository;

    public NotaFiscalService(NotaFiscalRepository notaFiscalRepository) {
        this.notaFiscalRepository = notaFiscalRepository;
    }

    public NotaFiscal emitirNotaFiscal(Venda venda) {
        // Lógica simplificada para o MVP
        // Em um cenário real, aqui haveria integração com uma API de NF-e
        NotaFiscal notaFiscal = new NotaFiscal();
        notaFiscal.setVenda(venda);
        notaFiscal.setNumero(generateNumeroNota()); // Gerar número único
        notaFiscal.setSerie("1");
        notaFiscal.setDataEmissao(LocalDateTime.now());
        notaFiscal.setStatus(StatusNotaFiscal.EMITIDA);
        notaFiscal.setChaveAcesso(generateChaveAcesso()); // Gerar chave de acesso
        notaFiscal.setLinkDanfe("http://link.para.danfe/" + notaFiscal.getNumero()); // Link mock
        // notaFiscal.setXmlContent("..."); // Conteúdo XML real

        return notaFiscalRepository.save(notaFiscal);
    }

    private String generateNumeroNota() {
        // Lógica para gerar um número de nota fiscal único
        return "NF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateChaveAcesso() {
        // Lógica para gerar uma chave de acesso única
        return UUID.randomUUID().toString().replace("-", "").substring(0, 44);
    }
}
