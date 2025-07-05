import { Routes } from '@angular/router';

export const VENDAS_ROUTES: Routes = [
  {
    path: 'clientes',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/cliente-list/cliente-list.component').then(m => m.ClienteListComponent),
        pathMatch: 'full'
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
      }
    ]
  },
  {
    path: 'vendas',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/venda-list/venda-list.component').then(m => m.VendaListComponent),
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/venda-detail/venda-detail.component').then(m => m.VendaDetailComponent)
      }
    ]
  },
  {
    path: 'pdv',
    loadComponent: () => import('./pages/pdv/pdv.component').then(m => m.PdvComponent)
  },
  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  }
];