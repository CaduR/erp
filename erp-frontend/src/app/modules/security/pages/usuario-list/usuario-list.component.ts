import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
  usuarios$: Observable<Usuario[]>;
  error: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.usuarios$ = this.usuarioService.listar();
  }

  ngOnInit(): void {
    this.usuarios$.subscribe({
      error: () => this.error = true
    });
  }

  editarUsuario(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/security/usuarios/editar', id]);
    }
  }

  deletarUsuario(id: string | undefined): void {
    if (!id) return;

    this.confirmDialogService.confirmDelete('Tem certeza que deseja excluir este usuário?').then((confirmed: boolean) => {
      if (confirmed) {
        this.usuarioService.deletar(id).subscribe(() => {
          this.usuarios$ = this.usuarioService.listar();
        });
      }
    });
  }

  visualizarUsuario(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/security/usuarios/visualizar', id]);
    }
  }
}
