import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ContaPagar, ContaPagarService } from '../../services/conta-pagar.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-conta-pagar-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './conta-pagar-list.component.html',
  styleUrls: ['./conta-pagar-list.component.scss']
})
export class ContaPagarListComponent implements OnInit {
  contasPagar$: Observable<ContaPagar[]>;
  error: boolean = false;

  constructor(
    private contaPagarService: ContaPagarService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.contasPagar$ = this.contaPagarService.listar();
  }

  ngOnInit(): void {
    this.contasPagar$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar contas a pagar.', 'error');
      }
    });
  }

  editarConta(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/financeiro/contas-a-pagar/editar', id]);
    }
  }

  deletarConta(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir esta conta?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.contaPagarService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Conta excluída com sucesso!', 'success');
            this.contasPagar$ = this.contaPagarService.listar(); // Recarrega a lista
            this.contasPagar$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar contas após exclusão.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir conta.', 'error');
          }
        });
      }
    });
  }

  pagarConta(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja marcar esta conta como paga?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.contaPagarService.pagar(id).subscribe({
          next: () => {
            this.toastService.show('Conta marcada como paga com sucesso!', 'success');
            this.contasPagar$ = this.contaPagarService.listar(); // Recarrega a lista
            this.contasPagar$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar contas após pagamento.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao marcar conta como paga.', 'error');
          }
        });
      }
    });
  }
}
