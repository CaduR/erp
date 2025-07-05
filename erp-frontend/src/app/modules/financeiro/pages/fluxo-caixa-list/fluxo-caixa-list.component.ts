import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FluxoCaixaService, LancamentoCaixa } from '../../services/fluxo-caixa.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-fluxo-caixa-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, FormsModule],
  templateUrl: './fluxo-caixa-list.component.html',
  styleUrls: ['./fluxo-caixa-list.component.scss']
})
export class FluxoCaixaListComponent implements OnInit {
  lancamentos$: Observable<LancamentoCaixa[]>;
  saldoAtual: number = 0;
  dataInicio: string;
  dataFim: string;
  error: boolean = false;

  constructor(
    private fluxoCaixaService: FluxoCaixaService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dataInicio = firstDayOfMonth.toISOString().split('T')[0];
    this.dataFim = today.toISOString().split('T')[0];
    this.lancamentos$ = new Observable<LancamentoCaixa[]>(); // Inicialização para evitar erro
  }

  ngOnInit(): void {
    this.carregarFluxoCaixa();
    this.carregarSaldoAtual();
  }

  carregarFluxoCaixa(): void {
    this.loadingService.show();
    this.lancamentos$ = this.fluxoCaixaService.listarPorPeriodo(this.dataInicio, this.dataFim);
    this.lancamentos$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar lançamentos do fluxo de caixa.', 'error');
      }
    });
  }

  carregarSaldoAtual(): void {
    this.loadingService.show();
    this.fluxoCaixaService.getSaldoAtual().subscribe({
      next: (saldo) => {
        this.saldoAtual = saldo;
        this.loadingService.hide();
      },
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar saldo atual.', 'error');
      }
    });
  }
}
