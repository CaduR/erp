import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  clienteForm!: FormGroup;
  isEditMode = false;
  clienteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['']
    });

    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.isEditMode = true;
      this.loadingService.show();
      this.clienteService.buscarPorId(this.clienteId).subscribe({
        next: (cliente) => {
          this.clienteForm.patchValue(cliente);
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastService.show('Erro ao carregar cliente.', 'error');
          console.error('Erro ao carregar cliente:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.toastService.show('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const clienteData = this.clienteForm.value;
    this.loadingService.show();

    if (this.isEditMode && this.clienteId) {
      this.clienteService.atualizar(this.clienteId, clienteData).subscribe({
        next: () => {
          this.toastService.show('Cliente atualizado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/vendas/clientes']);
        },
        error: (error) => {
          this.toastService.show('Erro ao atualizar cliente.', 'error');
          this.loadingService.hide();
          console.error('Erro ao atualizar cliente:', error);
        }
      });
    } else {
      this.clienteService.criar(clienteData).subscribe({
        next: () => {
          this.toastService.show('Cliente criado com sucesso!', 'success');
          this.loadingService.hide();
          this.router.navigate(['/vendas/clientes']);
        },
        error: (error) => {
          this.toastService.show('Erro ao criar cliente.', 'error');
          this.loadingService.hide();
          console.error('Erro ao criar cliente:', error);
        }
      });
    }
  }
}
