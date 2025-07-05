import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoCompraService, PedidoCompra } from '../../services/pedido-compra.service';
import { ContaPagarService } from '../../../financeiro/services/conta-pagar.service';
import { ProdutoService } from '../../../estoque/services/produto.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-recebimento-mercadoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './recebimento-mercadoria-form.component.html',
  styleUrls: ['./recebimento-mercadoria-form.component.scss']
})
export class RecebimentoMercadoriaFormComponent implements OnInit {
  recebimentoForm!: FormGroup;
  pedidoCompraId: string | null = null;
  pedidoCompra: PedidoCompra | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pedidoCompraService: PedidoCompraService,
    private contaPagarService: ContaPagarService,
    private produtoService: ProdutoService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.recebimentoForm = this.fb.group({
      itensRecebidos: this.fb.array([])
    });

    this.pedidoCompraId = this.route.snapshot.paramMap.get('id');
    if (this.pedidoCompraId) {
      this.loadingService.show();
      this.pedidoCompraService.buscarPorId(this.pedidoCompraId).subscribe({
        next: (pedido) => {
          this.pedidoCompra = pedido;
          this.popularFormComItensDoPedido();
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar pedido de compra.', 'error');
          console.error('Erro ao carregar pedido:', error);
        }
      });
    }
  }

  get itensRecebidos(): FormArray {
    return this.recebimentoForm.get('itensRecebidos') as FormArray;
  }

  private popularFormComItensDoPedido(): void {
    this.pedidoCompra?.itens.forEach(item => {
      this.itensRecebidos.push(this.fb.group({
        produtoId: [item.produtoId],
        quantidadeRecebida: [0, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  onSubmit(): void {
    if (this.recebimentoForm.invalid) {
      this.toastService.show('Preencha as quantidades recebidas.', 'warning');
      return;
    }

    const itensRecebidos = this.recebimentoForm.value.itensRecebidos.map((item: any, index: number) => ({
      produtoId: this.pedidoCompra?.itens[index].produtoId,
      quantidade: item.quantidadeRecebida
    }));

    if (this.pedidoCompraId) {
      this.loadingService.show();
      this.pedidoCompraService.receberMercadorias(this.pedidoCompraId, itensRecebidos).subscribe({
        next: () => {
          this.toastService.show('Mercadorias recebidas com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/compras/pedidos-compra']);
        },
        error: (error) => {
          this.toastService.show('Erro ao registrar recebimento.', 'error');
          this.loadingService.hide();
          console.error('Erro ao registrar recebimento:', error);
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/compras/pedidos-compra']);
  }
}
