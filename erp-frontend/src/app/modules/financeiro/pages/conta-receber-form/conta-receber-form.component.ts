import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContasReceberService, ContaReceber } from '../../services/contas-receber.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Cliente, ClienteService } from '../../../vendas/services/cliente.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-conta-receber-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './conta-receber-form.component.html',
  styleUrls: ['./conta-receber-form.component.scss']
})
export class ContaReceberFormComponent implements OnInit {
  contaReceberForm!: FormGroup;
  isEditMode = false;
  contaReceberId: string | null = null;
  clientes$: Observable<Cliente[]>;

  constructor(
    private fb: FormBuilder,
    private contasReceberService: ContasReceberService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.clientes$ = this.clienteService.listar();
  }

  ngOnInit(): void {
    this.contaReceberForm = this.fb.group({
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required],
      clienteId: [null, Validators.required]
    });

    this.contaReceberId = this.route.snapshot.paramMap.get('id');
    if (this.contaReceberId) {
      this.isEditMode = true;
      this.loadingService.show();
      this.contasReceberService.buscarPorId(Number(this.contaReceberId)).subscribe({
        next: (conta) => {
          this.contaReceberForm.patchValue({
            ...conta,
            dataVencimento: conta.dataVencimento ? new Date(conta.dataVencimento).toISOString().split('T')[0] : ''
          });
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar conta a receber.', 'error');
          console.error('Erro ao carregar conta:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.contaReceberForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const contaData: ContaReceber = this.contaReceberForm.value;
    this.loadingService.show();

    if (this.isEditMode && this.contaReceberId) {
      this.contasReceberService.atualizar(Number(this.contaReceberId), contaData).subscribe({
        next: () => {
          this.toastService.show('Conta a receber atualizada com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/financeiro/contas-receber']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar conta a receber.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar conta:', error);
        }
      });
    } else {
      this.contasReceberService.criar(contaData).subscribe({
        next: () => {
          this.toastService.show('Conta a receber criada com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/financeiro/contas-receber']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar conta a receber.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar conta:', error);
        }
      });
    }
  }
}
