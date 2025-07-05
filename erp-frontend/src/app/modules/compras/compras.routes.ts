import { Routes } from '@angular/router';

export const COMPRAS_ROUTES: Routes = [
  {
    path: 'fornecedores',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/fornecedor-list/fornecedor-list.component').then(m => m.FornecedorListComponent),
        pathMatch: 'full'
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/fornecedor-form/fornecedor-form.component').then(m => m.FornecedorFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/fornecedor-form/fornecedor-form.component').then(m => m.FornecedorFormComponent)
      }
    ]
  },
  {
    path: 'pedidos-compra',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/pedido-compra-list/pedido-compra-list.component').then(m => m.PedidoCompraListComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/pedido-compra-form/pedido-compra-form.component').then(m => m.PedidoCompraFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/pedido-compra-form/pedido-compra-form.component').then(m => m.PedidoCompraFormComponent)
      },
      {
        path: ':id/receber',
        loadComponent: () => import('./pages/recebimento-mercadoria-form/recebimento-mercadoria-form.component').then(m => m.RecebimentoMercadoriaFormComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'fornecedores',
    pathMatch: 'full'
  }
];