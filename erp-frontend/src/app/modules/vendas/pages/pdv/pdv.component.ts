import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ProdutoService, Produto } from '../../../estoque/services/produto.service';
import { VendaService, VendaRequest, VendaItem } from '../../services/venda.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.scss']
})
export class PdvComponent implements OnInit {
  form!: FormGroup;
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  itens: { produto: Produto, quantidade: number }[] = [];
  mensagem = '';
  erro = '';
  loading = false;
  avisoEstoque = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      clienteId: ['', Validators.required],
      produtoSelecionadoId: [''],
      quantidadeSelecionada: [0, [Validators.required, Validators.min(1)]]
    });
    this.carregarDados();
  }

  carregarDados() {
    this.clienteService.listar().subscribe({
      next: c => this.clientes = c,
      error: err => this.erro = 'Erro ao carregar clientes'
    });
    this.produtoService.getProdutos().subscribe({
      next: p => this.produtos = p,
      error: err => this.erro = 'Erro ao carregar produtos'
    });
  }

  onProdutoChange() {
    this.verificarEstoque();
  }

  verificarEstoque() {
    const produtoId = this.form.get('produtoSelecionadoId')?.value;
    const quantidade = this.form.get('quantidadeSelecionada')?.value;

    if (!produtoId || quantidade < 1) {
      this.avisoEstoque = '';
      return;
    }

    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) {
      this.avisoEstoque = '';
      return;
    }

    // Verificar quantidade já adicionada no carrinho
    const itemExistente = this.itens.find(i => i.produto.id === produto.id);
    const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
    const quantidadeTotal = quantidade + quantidadeNoCarrinho;

    if (quantidadeTotal > produto.quantidadeEstoque) {
      this.avisoEstoque = `Estoque insuficiente! Disponível: ${produto.quantidadeEstoque}, Solicitado: ${quantidadeTotal}`;
    } else if (quantidadeTotal === produto.quantidadeEstoque) {
      this.avisoEstoque = `Atenção: Quantidade exata do estoque disponível (${produto.quantidadeEstoque})`;
    } else {
      this.avisoEstoque = '';
    }
  }

  adicionarProduto() {
    const produtoId = this.form.get('produtoSelecionadoId')?.value;
    const quantidade = this.form.get('quantidadeSelecionada')?.value;

    if (!produtoId || quantidade < 1) return;

    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) return;

    // Verificar estoque antes de adicionar
    const itemExistente = this.itens.find(i => i.produto.id === produto.id);
    const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
    const quantidadeTotal = quantidade + quantidadeNoCarrinho;

    if (quantidadeTotal > produto.quantidadeEstoque) {
      this.erro = `Não é possível adicionar ${quantidade} unidades. Estoque disponível: ${produto.quantidadeEstoque - quantidadeNoCarrinho}`;
      return;
    }

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.itens.push({ produto, quantidade });
    }

    // Limpar campos de seleção
    this.form.patchValue({
      produtoSelecionadoId: '',
      quantidadeSelecionada: 0
    });

    this.avisoEstoque = '';
    this.erro = '';
  }

  removerItem(i: number) {
    this.itens.splice(i, 1);
    this.verificarEstoque();
  }

  get total() {
    return this.itens.reduce((sum, i) => sum + (i.produto.preco * i.quantidade), 0);
  }

  temEstoqueInsuficiente(): boolean {
    return this.itens.some(item => item.quantidade > item.produto.quantidadeEstoque);
  }

  finalizarVenda() {
    if (this.form.invalid || this.itens.length === 0) return;

    // Verificação final de estoque
    if (this.temEstoqueInsuficiente()) {
      this.erro = 'Não é possível finalizar a venda. Alguns produtos têm quantidade maior que o estoque disponível.';
      return;
    }

    this.loading = true;
    this.mensagem = '';
    this.erro = '';

    const venda: VendaRequest = {
      clienteId: this.form.value.clienteId,
      itens: this.itens.map(i => ({
        produtoId: i.produto.id!,
        quantidade: i.quantidade
      }))
    };

    this.vendaService.criarVenda(venda).subscribe({
      next: () => {
        this.mensagem = 'Venda realizada com sucesso!';
        this.loading = false;
        this.itens = [];
        this.form.reset();
        this.form.patchValue({ quantidadeSelecionada: 0 });
        this.avisoEstoque = '';
      },
      error: (err) => {
        this.erro = err.error?.message || err.error?.error || 'Erro ao realizar venda';
        this.loading = false;
      }
    });
  }

  decrement() {
    const val = Number(this.form.get('quantidadeSelecionada')?.value) || 0;
    if (val > 0) {
      this.form.get('quantidadeSelecionada')?.setValue(val - 1);
      this.verificarEstoque();
    }
  }

  increment() {
    const val = Number(this.form.get('quantidadeSelecionada')?.value) || 0;
    this.form.get('quantidadeSelecionada')?.setValue(val + 1);
    this.verificarEstoque();
  }
}
