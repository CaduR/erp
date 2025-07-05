package com.cadu.erp.estoque.services;

import com.cadu.erp.estoque.model.Produto;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoImportService {

    private final ProdutoRepository produtoRepository;

    public ProdutoImportService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public void importProdutosFromCsv(MultipartFile file) {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            List<Produto> produtos = new ArrayList<>();
            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                Produto produto = new Produto();
                produto.setNome(csvRecord.get("nome"));
                produto.setDescricao(csvRecord.get("descricao"));
                produto.setPreco(new BigDecimal(csvRecord.get("preco")));
                produto.setQuantidadeEstoque(Integer.parseInt(csvRecord.get("quantidadeEstoque")));
                produto.setUnidadeMedida(csvRecord.get("unidadeMedida"));
                // Adicione outros campos conforme necessário

                produtos.add(produto);
            }

            produtoRepository.saveAll(produtos);

        } catch (IOException e) {
            throw new RuntimeException("Falha ao importar dados CSV: " + e.getMessage());
        }
    }
}
