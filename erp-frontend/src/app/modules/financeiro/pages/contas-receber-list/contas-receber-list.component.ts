import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ContasReceberService, ContaReceber } from '../../services/contas-receber.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-contas-receber-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
  templateUrl: './contas-receber-list.component.html',
  styleUrls: ['./contas-receber-list.component.scss']
})
export class ContasReceberListComponent implements OnInit {
  contasReceber$: Observable<ContaReceber[]>;
  statusFilter: string = '';
  error: boolean = false;

  constructor(
    private contasReceberService: ContasReceberService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.contasReceber$ = this.contasReceberService.listar();
  }

  ngOnInit(): void {
    this.contasReceber$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar contas a receber.', 'error');
      }
    });
  }

  filtrar(): void {
    this.loadingService.show();
    if (this.statusFilter) {
      this.contasReceber$ = this.contasReceberService.buscarPorStatus(this.statusFilter);
    } else {
      this.contasReceber$ = this.contasReceberService.listar();
    }
    this.contasReceber$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao filtrar contas.', 'error');
      }
    });
  }

  novo(): void {
    this.router.navigate(['/financeiro/contas-receber/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/financeiro/contas-receber/editar', id]);
  }

  marcarComoPaga(id: number): void {
    this.confirmDialogService.confirmDelete('Deseja marcar esta conta como paga?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.contasReceberService.marcarComoPaga(id).subscribe({
          next: () => {
            this.toastService.show('Conta marcada como paga com sucesso!', 'success');
            this.contasReceber$ = this.contasReceberService.listar(); // Recarrega a lista
            this.contasReceber$.subscribe({
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

  excluir(id: number): void {
    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir esta conta?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.contasReceberService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Conta excluída com sucesso!', 'success');
            this.contasReceber$ = this.contasReceberService.listar(); // Recarrega a lista
            this.contasReceber$.subscribe({
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
}
