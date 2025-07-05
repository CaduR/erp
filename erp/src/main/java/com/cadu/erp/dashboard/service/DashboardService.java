package com.cadu.erp.dashboard.service;

import com.cadu.erp.dashboard.dto.DashboardStatsDTO;
import com.cadu.erp.estoque.repository.ProdutoRepository;
import com.cadu.erp.financeiro.repository.ContaPagarRepository;
import com.cadu.erp.financeiro.repository.ContaReceberRepository;
import com.cadu.erp.vendas.repository.ClienteRepository;
import com.cadu.erp.compras.repository.FornecedorRepository;
import com.cadu.erp.vendas.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ContaReceberRepository contasReceberRepository;
    private final ContaPagarRepository contaPagarRepository;
    private final VendaRepository vendaRepository;

    public DashboardService(ProdutoRepository produtoRepository,
                            ClienteRepository clienteRepository,
                            FornecedorRepository fornecedorRepository,
                            ContaReceberRepository contasReceberRepository,
                            ContaPagarRepository contaPagarRepository,
                            VendaRepository vendaRepository) {
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.contasReceberRepository = contasReceberRepository;
        this.contaPagarRepository = contaPagarRepository;
        this.vendaRepository = vendaRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalProdutos = produtoRepository.countByAtivoTrue();
        long produtosEstoqueBaixo = produtoRepository.countByQuantidadeEstoqueLessThanEqualQuantidadeMinima();
        long totalClientes = clienteRepository.count();
        long totalFornecedores = fornecedorRepository.count();

        // Contas a Receber
        long contasReceberAbertas = contasReceberRepository.countByStatus(com.cadu.erp.financeiro.model.StatusContaReceber.ABERTO);
        BigDecimal valorContasReceberAbertas = contasReceberRepository.sumValorByStatus(com.cadu.erp.financeiro.model.StatusContaReceber.ABERTO).orElse(BigDecimal.ZERO);

        // Contas a Pagar
        long contasPagarAbertas = contaPagarRepository.countByStatus(com.cadu.erp.financeiro.model.StatusContaPagar.PENDENTE);
        BigDecimal valorContasPagarAbertas = contaPagarRepository.sumValorByStatus(com.cadu.erp.financeiro.model.StatusContaPagar.PENDENTE).orElse(BigDecimal.ZERO);

        // Vendas Hoje
        LocalDateTime inicioHoje = LocalDate.now().atStartOfDay();
        LocalDateTime fimHoje = LocalDate.now().plusDays(1).atStartOfDay().minusNanos(1);
        BigDecimal vendasHoje = vendaRepository.sumValorTotalByDataVendaBetween(inicioHoje, fimHoje).orElse(BigDecimal.ZERO);

        // Vendas Mês
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMes = LocalDate.now().plusMonths(1).withDayOfMonth(1).atStartOfDay().minusNanos(1);
        BigDecimal vendasMes = vendaRepository.sumValorTotalByDataVendaBetween(inicioMes, fimMes).orElse(BigDecimal.ZERO);

        return DashboardStatsDTO.builder()
                .totalProdutos(totalProdutos)
                .produtosEstoqueBaixo(produtosEstoqueBaixo)
                .totalClientes(totalClientes)
                .totalFornecedores(totalFornecedores)
                .contasReceberAbertas(contasReceberAbertas)
                .valorContasReceberAbertas(valorContasReceberAbertas)
                .contasPagarAbertas(contasPagarAbertas)
                .valorContasPagarAbertas(valorContasPagarAbertas)
                .vendasHoje(vendasHoje)
                .vendasMes(vendasMes)
                .build();
    }
}