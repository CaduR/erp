import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-fluxo-caixa-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './fluxo-caixa-report.component.html',
  styleUrls: ['./fluxo-caixa-report.component.scss']
})
export class FluxoCaixaReportComponent implements OnInit {
  reportData$: Observable<any[]>;
  dataInicio: string;
  dataFim: string;
  error: boolean = false;

  constructor(
    private reportService: ReportService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dataInicio = firstDayOfMonth.toISOString().split('T')[0];
    this.dataFim = today.toISOString().split('T')[0];
    this.reportData$ = new Observable<any[]>(); // Initialize to avoid errors
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loadingService.show();
    this.reportData$ = this.reportService.getFluxoCaixaReport(this.dataInicio, this.dataFim);
    this.reportData$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar relatório de fluxo de caixa.', 'error');
      }
    });
  }
}
