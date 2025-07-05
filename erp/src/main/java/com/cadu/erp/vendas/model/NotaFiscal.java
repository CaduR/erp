package com.cadu.erp.vendas.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notas_fiscais")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Column(nullable = false)
    private String serie;

    @Column(nullable = false)
    private LocalDateTime dataEmissao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusNotaFiscal status;

    private String chaveAcesso;
    private String linkDanfe;
    private String xmlContent; // Para armazenar o XML da NF-e

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id", referencedColumnName = "id")
    private Venda venda;
}
