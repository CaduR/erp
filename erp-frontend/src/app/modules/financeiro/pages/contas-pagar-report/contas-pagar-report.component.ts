import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-contas-pagar-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './contas-pagar-report.component.html',
  styleUrls: ['./contas-pagar-report.component.scss']
})
export class ContasPagarReportComponent implements OnInit {
  reportData$: Observable<any[]>;
  statusFilter: string = '';
  error: boolean = false;

  constructor(
    private reportService: ReportService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.reportData$ = new Observable<any[]>(); // Initialize to avoid errors
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loadingService.show();
    this.reportData$ = this.reportService.getContasPagarReport(this.statusFilter);
    this.reportData$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar relatório de contas a pagar.', 'error');
      }
    });
  }
}
