import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEditMode = false;
  isViewMode = false;
  usuarioId: string | null = null;
  allRoles$: Observable<Role[]>;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.allRoles$ = this.roleService.listar();
  }

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', []],
      ativo: [true],
      roleIds: ['']
    });

    this.usuarioId = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (url.includes('/visualizar/')) {
      this.isViewMode = true;
    } else if (this.usuarioId) {
      this.isEditMode = true;
    }
    if (this.usuarioId) {
      this.usuarioService.buscarPorId(this.usuarioId).subscribe(usuario => {
        this.usuarioForm.patchValue({
          username: usuario.username,
          email: usuario.email,
          ativo: usuario.ativo,
          roleIds: usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].id : ''
        });
        if (this.isViewMode) {
          this.usuarioForm.disable();
        }
      });
    } else {
      this.usuarioForm.get('password')?.setValidators([Validators.required]);
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }
  }

  onRoleChange(event: any): void {
    const roleId = Number(event.target.value);
    const currentRoleIds = this.usuarioForm.get('roleIds')?.value as number[];

    if (event.target.checked) {
      // Adicionar role
      if (!currentRoleIds.includes(roleId)) {
        this.usuarioForm.get('roleIds')?.setValue([...currentRoleIds, roleId]);
      }
    } else {
      // Remover role
      this.usuarioForm.get('roleIds')?.setValue(currentRoleIds.filter(id => id !== roleId));
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      return;
    }

    const usuarioData = this.usuarioForm.value;
    // Ajusta roleIds para array, se necessário
    usuarioData.roleIds = usuarioData.roleIds ? [usuarioData.roleIds] : [];
    // Remove a senha se não estiver em modo de edição e não foi alterada
    if (this.isEditMode && !usuarioData.password) {
      delete usuarioData.password;
    }

    if (this.isEditMode && this.usuarioId) {
      this.usuarioService.atualizar(this.usuarioId, usuarioData).subscribe(() => {
        this.router.navigate(['/security/usuarios']);
      });
    } else {
      this.usuarioService.criar(usuarioData).subscribe(() => {
        this.router.navigate(['/security/usuarios']);
      });
    }
  }
}
