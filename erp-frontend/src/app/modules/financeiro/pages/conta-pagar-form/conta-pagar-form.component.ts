import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContaPagar, ContaPagarService } from '../../services/conta-pagar.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorService } from '../../../compras/services/fornecedor.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-conta-pagar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './conta-pagar-form.component.html',
  styleUrls: ['./conta-pagar-form.component.scss']
})
export class ContaPagarFormComponent implements OnInit {
  contaPagarForm!: FormGroup;
  isEditMode = false;
  contaPagarId: string | null = null;
  fornecedores$: Observable<Fornecedor[]>;

  constructor(
    private fb: FormBuilder,
    private contaPagarService: ContaPagarService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.fornecedores$ = this.fornecedorService.listar();
  }

  ngOnInit(): void {
    this.contaPagarForm = this.fb.group({
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required],
      fornecedorId: [null]
    });

    this.contaPagarId = this.route.snapshot.paramMap.get('id');
    if (this.contaPagarId) {
      this.isEditMode = true;
      this.loadingService.show();
      this.contaPagarService.buscarPorId(this.contaPagarId).subscribe({
        next: (conta) => {
          this.contaPagarForm.patchValue({
            ...conta,
            dataVencimento: conta.dataVencimento ? new Date(conta.dataVencimento).toISOString().split('T')[0] : ''
          });
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar conta a pagar.', 'error');
          console.error('Erro ao carregar conta:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.contaPagarForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const contaData: ContaPagar = this.contaPagarForm.value;
    this.loadingService.show();

    if (this.isEditMode && this.contaPagarId) {
      this.contaPagarService.atualizar(this.contaPagarId, contaData).subscribe({
        next: () => {
          this.toastService.show('Conta a pagar atualizada com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/financeiro/contas-a-pagar']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar conta a pagar.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar conta:', error);
        }
      });
    } else {
      this.contaPagarService.criar(contaData).subscribe({
        next: () => {
          this.toastService.show('Conta a pagar criada com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/financeiro/contas-a-pagar']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar conta a pagar.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar conta:', error);
        }
      });
    }
  }
}
