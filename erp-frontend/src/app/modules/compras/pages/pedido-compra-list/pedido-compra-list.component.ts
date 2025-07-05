import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoCompra, PedidoCompraService } from '../../services/pedido-compra.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-pedido-compra-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './pedido-compra-list.component.html',
  styleUrls: ['./pedido-compra-list.component.scss']
})
export class PedidoCompraListComponent implements OnInit {
  pedidosCompra$: Observable<PedidoCompra[]>;
  error: boolean = false;

  constructor(
    private pedidoCompraService: PedidoCompraService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.pedidosCompra$ = this.pedidoCompraService.listar();
  }

  ngOnInit(): void {
    this.pedidosCompra$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar pedidos de compra.', 'error');
      }
    });
  }

  editarPedido(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/compras/pedidos-compra/editar', id]);
    }
  }

  deletarPedido(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir este pedido de compra?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.pedidoCompraService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Pedido de compra excluído com sucesso!', 'success');
            this.pedidosCompra$ = this.pedidoCompraService.listar(); // Recarrega a lista
            this.pedidosCompra$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar pedidos após exclusão.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir pedido de compra.', 'error');
          }
        });
      }
    });
  }

  aprovarPedido(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja aprovar este pedido de compra?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.pedidoCompraService.aprovar(id).subscribe({
          next: () => {
            this.toastService.show('Pedido de compra aprovado com sucesso!', 'success');
            this.pedidosCompra$ = this.pedidoCompraService.listar(); // Recarrega a lista
            this.pedidosCompra$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar pedidos após aprovação.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao aprovar pedido de compra.', 'error');
          }
        });
      }
    });
  }

  cancelarPedido(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja cancelar este pedido de compra?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.pedidoCompraService.cancelar(id).subscribe({
          next: () => {
            this.toastService.show('Pedido de compra cancelado com sucesso!', 'success');
            this.pedidosCompra$ = this.pedidoCompraService.listar(); // Recarrega a lista
            this.pedidosCompra$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar pedidos após cancelamento.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao cancelar pedido de compra.', 'error');
          }
        });
      }
    });
  }

  receberMercadorias(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/compras/pedidos-compra', id, 'receber']);
  }
}
