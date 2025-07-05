import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FornecedorService, Fornecedor } from '../../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {
  fornecedorForm!: FormGroup;
  isEditMode = false;
  fornecedorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['']
    });

    this.fornecedorId = this.route.snapshot.paramMap.get('id');
    if (this.fornecedorId) {
      this.isEditMode = true;
      this.loadingService.show();
      this.fornecedorService.buscarPorId(this.fornecedorId).subscribe({
        next: (fornecedor) => {
          this.fornecedorForm.patchValue(fornecedor);
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar fornecedor.', 'error');
          console.error('Erro ao carregar fornecedor:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.fornecedorForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const fornecedorData = this.fornecedorForm.value;
    this.loadingService.show();

    if (this.isEditMode && this.fornecedorId) {
      this.fornecedorService.atualizar(this.fornecedorId, fornecedorData).subscribe({
        next: () => {
          this.toastService.show('Fornecedor atualizado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/compras/fornecedores']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar fornecedor.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar fornecedor:', error);
        }
      });
    } else {
      this.fornecedorService.criar(fornecedorData).subscribe({
        next: () => {
          this.toastService.show('Fornecedor criado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/compras/fornecedores']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar fornecedor.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar fornecedor:', error);
        }
      });
    }
  }
}
