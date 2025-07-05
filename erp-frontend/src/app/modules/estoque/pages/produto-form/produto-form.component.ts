import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {
  produtoForm!: FormGroup;
  isEditMode = false;
  isViewMode = false;
  produtoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      descricao: [''],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      quantidadeEstoque: [0, [Validators.required, Validators.min(0)]],
      quantidadeMinima: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      unidadeMedida: ['', Validators.required],
    });

    this.produtoId = this.route.snapshot.paramMap.get('id');
    this.isViewMode = this.route.snapshot.url.some(segment => segment.path === 'visualizar');
    if (this.produtoId) {
      this.isEditMode = !this.isViewMode;
      // Adicionar campo ativo apenas para edição
      if (this.isEditMode) {
        this.produtoForm.addControl('ativo', this.fb.control(true));
      }
      this.loadingService.show();
      this.produtoService.getProduto(this.produtoId).subscribe({
        next: (produto) => {
          this.produtoForm.patchValue(produto);
          if (this.isViewMode) {
            this.produtoForm.disable();
          }
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar produto.', 'error');
          console.error('Erro ao carregar produto:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isViewMode) {
      return; // Não permite envio em modo de visualização
    }
    
    if (this.produtoForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const produtoData = this.produtoForm.value;
    if (!this.isEditMode) {
      produtoData.ativo = true;
    }
    this.loadingService.show();

    if (this.isEditMode && this.produtoId) {
      this.produtoService.updateProduto(this.produtoId, produtoData).subscribe({
        next: () => {
          this.toastService.show('Produto atualizado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/estoque/produtos']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar produto.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar produto:', error);
        }
      });
    } else {
      this.produtoService.createProduto(produtoData).subscribe({
        next: () => {
          this.toastService.show('Produto criado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/estoque/produtos']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar produto.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar produto:', error);
        }
      });
    }
  }
}
 