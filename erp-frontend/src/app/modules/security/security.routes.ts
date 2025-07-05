import { Routes } from '@angular/router';

export const SECURITY_ROUTES: Routes = [
  {
    path: 'usuarios',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
        pathMatch: 'full'
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'visualizar/:id',
        loadComponent: () => import('./pages/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'cadastro',
        loadComponent: () => import('./pages/usuario-cadastro-form/usuario-cadastro-form.component').then(m => m.UsuarioCadastroFormComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  }
];
