import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoCompra, PedidoCompraItem, PedidoCompraService } from '../../services/pedido-compra.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorService } from '../../services/fornecedor.service';
import { Produto, ProdutoService } from '../../../estoque/services/produto.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-pedido-compra-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pedido-compra-form.component.html',
  styleUrls: ['./pedido-compra-form.component.scss']
})
export class PedidoCompraFormComponent implements OnInit {
  pedidoCompraForm!: FormGroup;
  isEditMode = false;
  pedidoCompraId: string | null = null;
  fornecedores$: Observable<Fornecedor[]>;
  produtos$: Observable<Produto[]>;

  constructor(
    private fb: FormBuilder,
    private pedidoCompraService: PedidoCompraService,
    private fornecedorService: FornecedorService,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.fornecedores$ = this.fornecedorService.listar();
    this.produtos$ = this.produtoService.getProdutos();
  }

  ngOnInit(): void {
    this.pedidoCompraForm = this.fb.group({
      fornecedorId: [null, Validators.required],
      dataPedido: ['', Validators.required],
      status: ['PENDENTE'],
      itens: this.fb.array([], Validators.required),
      valorTotal: [{ value: 0, disabled: true }]
    });

    this.pedidoCompraId = this.route.snapshot.paramMap.get('id');
    if (this.pedidoCompraId) {
      this.isEditMode = true;
      this.loadingService.show();
      this.pedidoCompraService.buscarPorId(this.pedidoCompraId).subscribe({
        next: (pedido) => {
          this.pedidoCompraForm.patchValue({
            fornecedorId: pedido.fornecedorId,
            dataPedido: pedido.dataPedido ? new Date(pedido.dataPedido).toISOString().split('T')[0] : '',
            status: pedido.status,
            valorTotal: pedido.valorTotal
          });
          pedido.itens.forEach(item => this.adicionarItem(item));
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

  get itens(): FormArray {
    return this.pedidoCompraForm.get('itens') as FormArray;
  }

  adicionarItem(item?: PedidoCompraItem): void {
    const itemGroup = this.fb.group({
      produtoId: [item ? item.produtoId : null, Validators.required],
      quantidade: [item ? item.quantidade : 0, [Validators.required, Validators.min(1)]],
      valorUnitario: [item ? item.valorUnitario : 0, [Validators.required, Validators.min(0.01)]]
    });
    this.itens.push(itemGroup);
    this.calcularValorTotal();
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
    this.calcularValorTotal();
  }

  onProdutoChange(index: number): void {
    const produtoId = this.itens.at(index).get('produtoId')?.value;
    if (produtoId) {
      this.produtoService.getProduto(produtoId).subscribe(produto => {
        this.itens.at(index).get('valorUnitario')?.setValue(produto.preco);
        this.calcularValorTotal();
      });
    }
  }

  calcularValorTotal(): void {
    let total = 0;
    this.itens.controls.forEach(itemGroup => {
      const quantidade = itemGroup.get('quantidade')?.value || 0;
      const valorUnitario = itemGroup.get('valorUnitario')?.value || 0;
      total += quantidade * valorUnitario;
    });
    this.pedidoCompraForm.get('valorTotal')?.setValue(total);
  }

  onFornecedorChange(): void {
    // Lógica a ser implementada se necessário ao mudar o fornecedor
  }

  onSubmit(): void {
    if (this.pedidoCompraForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios e adicione itens ao pedido.', 'warning');
      return;
    }

    const pedidoData: PedidoCompra = this.pedidoCompraForm.getRawValue(); // Use getRawValue para incluir campos desabilitados
    this.loadingService.show();

    if (this.isEditMode && this.pedidoCompraId) {
      this.pedidoCompraService.atualizar(this.pedidoCompraId, pedidoData).subscribe({
        next: () => {
          this.toastService.show('Pedido de compra atualizado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/compras/pedidos-compra']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar pedido de compra.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar pedido:', error);
        }
      });
    } else {
      this.pedidoCompraService.criar(pedidoData).subscribe({
        next: () => {
          this.toastService.show('Pedido de compra criado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/compras/pedidos-compra']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar pedido de compra.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar pedido:', error);
        }
      });
    }
  }
}