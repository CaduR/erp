import { Routes } from '@angular/router';

export const ESTOQUE_ROUTES: Routes = [
  {
    path: 'produtos',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/produto-list/produto-list.component').then(m => m.ProdutoListComponent),
        pathMatch: 'full' // Garante que a rota /produtos carregue a lista
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/produto-form/produto-form.component').then(m => m.ProdutoFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/produto-form/produto-form.component').then(m => m.ProdutoFormComponent)
      },
      {
        path: 'visualizar/:id',
        loadComponent: () => import('./pages/produto-form/produto-form.component').then(m => m.ProdutoFormComponent)
      }
    ]
  },
  {
    path: 'kardex',
    loadComponent: () => import('./pages/kardex-list/kardex-list.component').then(m => m.KardexListComponent)
  },
  {
    path: '',
    redirectTo: 'produtos',
    pathMatch: 'full'
  }
]; 