import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReportService, BalancoPatrimonialDTO } from '../../services/report.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-balanco-patrimonial-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './balanco-patrimonial-report.component.html',
  styleUrls: ['./balanco-patrimonial-report.component.scss']
})
export class BalancoPatrimonialReportComponent implements OnInit {
  balancoData$: Observable<BalancoPatrimonialDTO>;
  dataReferencia: string;
  error: boolean = false;

  constructor(
    private reportService: ReportService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.dataReferencia = new Date().toISOString().split('T')[0];
    this.balancoData$ = new Observable<BalancoPatrimonialDTO>(); // Initialize to avoid errors
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loadingService.show();
    this.balancoData$ = this.reportService.getBalancoPatrimonial(this.dataReferencia);
    this.balancoData$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar Balanço Patrimonial.', 'error');
      }
    });
  }
}
