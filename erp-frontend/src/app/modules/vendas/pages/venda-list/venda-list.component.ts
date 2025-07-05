import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { VendaService, VendaResponse } from '../../services/venda.service';
import { NotaFiscalService } from '../../services/nota-fiscal.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-venda-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './venda-list.component.html',
  styleUrls: ['./venda-list.component.scss']
})
export class VendaListComponent implements OnInit {
  vendas$: Observable<VendaResponse[]>;
  error: boolean = false;

  constructor(
    private vendaService: VendaService,
    private notaFiscalService: NotaFiscalService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.vendas$ = this.vendaService.listarVendas();
  }

  ngOnInit(): void {
    this.vendas$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar vendas.', 'error');
      }
    });
  }

  verDetalhes(id: string | undefined): void {
    if (id) {
      // Implementar navegação para detalhes da venda, se houver
      this.toastService.show('Funcionalidade de detalhes da venda não implementada.', 'info');
    }
  }

  emitirNota(vendaId: string | undefined): void {
    if (!vendaId) return;

    this.confirmDialogService.confirmDelete('Deseja emitir a nota fiscal para esta venda?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.notaFiscalService.emitirNota(vendaId).subscribe({
          next: () => {
            this.toastService.show('Nota fiscal emitida com sucesso!', 'success');
            this.vendas$ = this.vendaService.listarVendas(); // Recarrega a lista
            this.vendas$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar vendas após emissão de NF.', 'error');
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            this.toastService.show('Erro ao emitir nota fiscal.', 'error');
            console.error('Erro ao emitir NF:', error);
          }
        });
      }
    });
  }

  deletarVenda(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir esta venda?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
                this.vendaService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Venda excluída com sucesso!', 'success');
            this.vendas$ = this.vendaService.listarVendas();
            this.vendas$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar vendas após exclusão.', 'error');
              }
            });
          },
          error: (error) => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir venda.', 'error');
          }
        });
      }
    });
  }
}
