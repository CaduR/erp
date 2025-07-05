import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MovimentacaoEstoqueService, MovimentacaoEstoque } from '../../services/movimentacao-estoque.service';
import { ProdutoService, Produto } from '../../services/produto.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-kardex-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  providers: [MovimentacaoEstoqueService], // Explicitly provide the service
  templateUrl: './kardex-list.component.html',
  styleUrls: ['./kardex-list.component.scss']
})
export class KardexListComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  kardexEntries$: Observable<MovimentacaoEstoque[]>;
  selectedProductId: string | null = null;
  error: boolean = false;

  constructor(
    private movimentacaoEstoqueService: MovimentacaoEstoqueService,
    private produtoService: ProdutoService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.produtos$ = this.produtoService.getProdutos();
    this.kardexEntries$ = new Observable<MovimentacaoEstoque[]>(); // Initialize to avoid errors
  }

  ngOnInit(): void {
    // Optionally load kardex for a default product or first product
  }

  loadKardex(): void {
    if (!this.selectedProductId) {
      this.kardexEntries$ = new Observable<MovimentacaoEstoque[]>();
      return;
    }

    this.loadingService.show();
    this.kardexEntries$ = this.movimentacaoEstoqueService.buscarMovimentacoesPorProduto(this.selectedProductId);
    this.kardexEntries$.subscribe({
      next: () => this.loadingService.hide(),
      error: () => {
        this.error = true;
        this.loadingService.hide();
        this.toastService.show('Erro ao carregar movimentações do Kardex.', 'error');
      }
    });
  }
}
