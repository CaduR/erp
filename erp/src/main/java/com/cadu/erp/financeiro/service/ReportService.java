package com.cadu.erp.financeiro.service;

import com.cadu.erp.financeiro.dto.BalancoPatrimonialDTO;
import com.cadu.erp.financeiro.dto.DRE_DTO;
import com.cadu.erp.financeiro.model.ContaPagar;
import com.cadu.erp.financeiro.model.ContaReceber;
import com.cadu.erp.financeiro.model.StatusContaPagar;
import com.cadu.erp.financeiro.model.StatusContaReceber;
import com.cadu.erp.financeiro.repository.ContaPagarRepository;
import com.cadu.erp.financeiro.repository.ContaReceberRepository;
import com.cadu.erp.vendas.model.Venda;
import com.cadu.erp.vendas.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ContaReceberRepository contaReceberRepository;
    private final ContaPagarRepository contaPagarRepository;
    private final VendaRepository vendaRepository;

    public ReportService(ContaReceberRepository contaReceberRepository,
                         ContaPagarRepository contaPagarRepository,
                         VendaRepository vendaRepository) {
        this.contaReceberRepository = contaReceberRepository;
        this.contaPagarRepository = contaPagarRepository;
        this.vendaRepository = vendaRepository;
    }

    public DRE_DTO gerarDRE(LocalDate dataInicio, LocalDate dataFim) {
        // Receita Bruta de Vendas (total de vendas no período)
        BigDecimal receitaBrutaVendas = vendaRepository.sumValorTotalByDataVendaBetween(
                dataInicio.atStartOfDay(), dataFim.plusDays(1).atStartOfDay().minusNanos(1))
                .orElse(BigDecimal.ZERO);

        // Para o MVP, simplificamos algumas contas
        BigDecimal deducoesVendas = BigDecimal.ZERO; // Ex: devoluções, abatimentos
        BigDecimal custoMercadoriasVendidas = BigDecimal.ZERO; // CMV
        BigDecimal despesasComVendas = BigDecimal.ZERO; // Ex: comissões, fretes
        BigDecimal despesasAdministrativas = BigDecimal.ZERO; // Ex: aluguel, salários
        BigDecimal despesasFinanceiras = BigDecimal.ZERO; // Ex: juros pagos
        BigDecimal outrasDespesasOperacionais = BigDecimal.ZERO;
        BigDecimal receitasNaoOperacionais = BigDecimal.ZERO;
        BigDecimal despesasNaoOperacionais = BigDecimal.ZERO;
        BigDecimal impostoRenda = BigDecimal.ZERO;
        BigDecimal contribuicaoSocial = BigDecimal.ZERO;

        // Cálculo simplificado
        BigDecimal receitaLiquidaVendas = receitaBrutaVendas.subtract(deducoesVendas);
        BigDecimal lucroBruto = receitaLiquidaVendas.subtract(custoMercadoriasVendidas);
        BigDecimal totalDespesasOperacionais = despesasComVendas
                .add(despesasAdministrativas)
                .add(despesasFinanceiras)
                .add(outrasDespesasOperacionais);
        BigDecimal lucroPrejuizoOperacional = lucroBruto.subtract(totalDespesasOperacionais);
        BigDecimal lucroPrejuizoAntesIRCSLL = lucroPrejuizoOperacional
                .add(receitasNaoOperacionais)
                .subtract(despesasNaoOperacionais);
        BigDecimal lucroLiquidoExercicio = lucroPrejuizoAntesIRCSLL
                .subtract(impostoRenda)
                .subtract(contribuicaoSocial);

        return DRE_DTO.builder()
                .dataInicio(dataInicio)
                .dataFim(dataFim)
                .receitaBrutaVendas(receitaBrutaVendas)
                .deducoesVendas(deducoesVendas)
                .receitaLiquidaVendas(receitaLiquidaVendas)
                .custoMercadoriasVendidas(custoMercadoriasVendidas)
                .lucroBruto(lucroBruto)
                .despesasComVendas(despesasComVendas)
                .despesasAdministrativas(despesasAdministrativas)
                .despesasFinanceiras(despesasFinanceiras)
                .outrasDespesasOperacionais(outrasDespesasOperacionais)
                .totalDespesasOperacionais(totalDespesasOperacionais)
                .lucroPrejuizoOperacional(lucroPrejuizoOperacional)
                .receitasNaoOperacionais(receitasNaoOperacionais)
                .despesasNaoOperacionais(despesasNaoOperacionais)
                .lucroPrejuizoAntesIRCSLL(lucroPrejuizoAntesIRCSLL)
                .impostoRenda(impostoRenda)
                .contribuicaoSocial(contribuicaoSocial)
                .lucroLiquidoExercicio(lucroLiquidoExercicio)
                .build();
    }

    public BalancoPatrimonialDTO gerarBalancoPatrimonial(LocalDate dataReferencia) {
        // Ativo Circulante: Contas a Receber em aberto
        BigDecimal ativoCirculante = contaReceberRepository.sumValorByStatus(StatusContaReceber.ABERTO).orElse(BigDecimal.ZERO);

        // Passivo Circulante: Contas a Pagar pendentes
        BigDecimal passivoCirculante = contaPagarRepository.sumValorByStatus(StatusContaPagar.PENDENTE).orElse(BigDecimal.ZERO);

        // Para o MVP, simplificamos
        BigDecimal ativoNaoCirculante = BigDecimal.ZERO;
        BigDecimal passivoNaoCirculante = BigDecimal.ZERO;
        BigDecimal patrimonioLiquido = (ativoCirculante.add(ativoNaoCirculante)).subtract(passivoCirculante.add(passivoNaoCirculante));

        BigDecimal totalAtivo = ativoCirculante.add(ativoNaoCirculante);
        BigDecimal totalPassivo = passivoCirculante.add(passivoNaoCirculante);
        BigDecimal totalPassivoPatrimonioLiquido = totalPassivo.add(patrimonioLiquido);

        return BalancoPatrimonialDTO.builder()
                .dataReferencia(dataReferencia)
                .ativoCirculante(ativoCirculante)
                .ativoNaoCirculante(ativoNaoCirculante)
                .totalAtivo(totalAtivo)
                .passivoCirculante(passivoCirculante)
                .passivoNaoCirculante(passivoNaoCirculante)
                .totalPassivo(totalPassivo)
                .patrimonioLiquido(patrimonioLiquido)
                .totalPassivoPatrimonioLiquido(totalPassivoPatrimonioLiquido)
                .build();
    }
}
