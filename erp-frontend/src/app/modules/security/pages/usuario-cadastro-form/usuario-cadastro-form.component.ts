import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioCadastroFormService, UsuarioCadastroRequest } from './usuario-cadastro-form.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-usuario-cadastro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './usuario-cadastro-form.component.html',
  styleUrls: ['./usuario-cadastro-form.component.scss']
})
export class UsuarioCadastroFormComponent {
  cadastroForm: FormGroup;
  funcoes = [
    'Administrador',
    'Gestor / Gerente',
    'Operador de Caixa / Vendedor',
    'Comprador / Responsável de Compras',
    'Almoxarife / Responsável de Stock',
    'Financeiro'
  ];
  mensagem: string | null = null;
  erro: string | null = null;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioCadastroFormService, private router: Router) {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senhaProvisoria: ['', Validators.required],
      funcao: ['', Validators.required]
    });
  }

  onSubmit() {
    this.mensagem = null;
    this.erro = null;
    if (this.cadastroForm.valid) {
      const req: UsuarioCadastroRequest = this.cadastroForm.value;
      this.usuarioService.cadastrarUsuario(req).subscribe({
        next: () => {
          this.mensagem = 'Usuário cadastrado com sucesso!';
          this.cadastroForm.reset();
          setTimeout(() => {
            this.router.navigate(['/security/usuarios']);
          }, 1000);
        },
        error: (err) => {
          this.erro = 'Erro ao cadastrar usuário.';
        }
      });
    }
  }
} 