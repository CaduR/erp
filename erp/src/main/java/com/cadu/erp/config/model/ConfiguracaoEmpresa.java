package com.cadu.erp.config.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "configuracao_empresa")
@Data
public class ConfiguracaoEmpresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeEmpresa;

    @Column(unique = true)
    private String cnpj;

    private String endereco;
    private String telefone;
    private String email;

    @Lob // Para armazenar URLs de imagens ou base64 de logos
    @Column(length = 1000000) // Aumenta o tamanho para URLs longas ou base64
    private String logoUrl;
}
