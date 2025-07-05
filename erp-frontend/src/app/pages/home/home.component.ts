import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stats: DashboardStats = {
    totalProdutos: 0,
    produtosEstoqueBaixo: 0,
    totalClientes: 0,
    totalFornecedores: 0,
    contasReceberAbertas: 0,
    valorContasReceberAbertas: 0,
    contasPagarAbertas: 0,
    valorContasPagarAbertas: 0,
    vendasHoje: 0,
    vendasMes: 0
  };
  error: boolean = false;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  private loadDashboardStats() {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error: any) => {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        this.error = true;
      }
    });
  }
}