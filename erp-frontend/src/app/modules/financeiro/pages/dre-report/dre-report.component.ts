import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReportService, DRE_DTO } from '../../services/report.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-dre-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './dre-report.component.html',
  styleUrls: ['./dre-report.component.scss']
})
export class DreReportComponent implements OnInit {
  dreData$: Observable<DRE_DTO>;
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
    this.dreData$ = new Observable<DRE_DTO>(); // Initialize to avoid errors
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loadingService.show();
    this.dreData$ = this.reportService.getDRE(this.dataInicio, this.dataFim);
    this.dreData$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar DRE.', 'error');
      }
    });
  }
}
