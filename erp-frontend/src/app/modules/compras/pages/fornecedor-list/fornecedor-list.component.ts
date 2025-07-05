import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorService } from '../../services/fornecedor.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.scss']
})
export class FornecedorListComponent implements OnInit {
  fornecedores$: Observable<Fornecedor[]>;
  error: boolean = false;

  constructor(
    private fornecedorService: FornecedorService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.fornecedores$ = this.fornecedorService.listar();
  }

  ngOnInit(): void {
    this.fornecedores$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar fornecedores.', 'error');
      }
    });
  }

  editarFornecedor(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/compras/fornecedores/editar', id]);
    }
  }

  deletarFornecedor(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir este fornecedor?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.fornecedorService.deletar(id).subscribe({
          next: () => {
            this.toastService.show('Fornecedor excluído com sucesso!', 'success');
            this.fornecedores$ = this.fornecedorService.listar(); // Recarrega a lista
            this.fornecedores$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar fornecedores após exclusão.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir fornecedor.', 'error');
          }
        });
      }
    });
  }
}
