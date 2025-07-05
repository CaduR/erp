import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente, ClienteService } from '../../services/cliente.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  clientes$: Observable<Cliente[]>;
  error: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.clientes$ = this.clienteService.listar();
  }

  ngOnInit(): void {
    this.clientes$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar clientes.', 'error');
      }
    });
  }

  editarCliente(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/vendas/clientes/editar', id]);
    }
  }

  deletarCliente(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir este cliente?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.clienteService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Cliente excluído com sucesso!', 'success');
            this.clientes$ = this.clienteService.listar(); // Recarrega a lista
            this.clientes$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar clientes após exclusão.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir cliente.', 'error');
          }
        });
      }
    });
  }
}

