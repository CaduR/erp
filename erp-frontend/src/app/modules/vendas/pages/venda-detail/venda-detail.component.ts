import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VendaService, VendaResponse } from '../../services/venda.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-venda-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './venda-detail.component.html',
  styleUrls: ['./venda-detail.component.scss']
})
export class VendaDetailComponent implements OnInit {
  venda$: Observable<VendaResponse>;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendaService: VendaService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    const vendaId = this.route.snapshot.paramMap.get('id');
    if (vendaId) {
      this.loadingService.show();
      this.venda$ = this.vendaService.buscarVendaPorId(vendaId);
      this.venda$.subscribe({
        next: () => this.loadingService.hide(),
        error: () => {
          this.error = true;
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar detalhes da venda.', 'error');
        }
      });
    } else {
      this.toastService.show('ID da venda não fornecido.', 'error');
      this.router.navigate(['/vendas/vendas']);
      this.venda$ = new Observable<VendaResponse>(); // Initialize to avoid TS2564
    }
  }

  ngOnInit(): void { }

  voltar(): void {
    this.router.navigate(['/vendas/vendas']);
  }
}
