import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Produto, ProdutoService } from '../../services/produto.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  error: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadingService.show();
    this.produtos$ = this.produtoService.getProdutos();
  }

  ngOnInit(): void {
    this.produtos$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar produtos.', 'error');
      }
    });
  }

  editarProduto(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/estoque/produtos/editar', id]);
    }
  }

  visualizarProduto(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/estoque/produtos/visualizar', id]);
    }
  }

  deletarProduto(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir este produto?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.show();
        this.produtoService.deleteProduto(id).subscribe({
          next: () => {
            this.toastService.show('Produto excluído com sucesso!', 'success');
            this.produtos$ = this.produtoService.getProdutos(); // Recarrega a lista
            this.produtos$.subscribe({
              next: () => this.loadingService.hide(),
              error: () => {
                this.error = true;
                this.loadingService.hide();
                this.toastService.show('Erro ao recarregar produtos após exclusão.', 'error');
              }
            });
          },
          error: () => {
            this.loadingService.hide();
            this.toastService.show('Erro ao excluir produto.', 'error');
          }
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.loadingService.show();
      this.produtoService.importProdutos(file).subscribe({
        next: () => {
          this.toastService.show('Produtos importados com sucesso!', 'success');
          this.produtos$ = this.produtoService.getProdutos(); // Recarrega a lista
          this.produtos$.subscribe({
            next: () => this.loadingService.hide(),
            error: () => {
              this.error = true;
              this.loadingService.hide();
              this.toastService.show('Erro ao recarregar produtos após importação.', 'error');
            }
          });
        },
        error: (err) => {
          this.loadingService.hide();
          this.toastService.show(`Erro ao importar produtos: ${err.error || err.message}`, 'error');
        }
      });
    }
  }
}

