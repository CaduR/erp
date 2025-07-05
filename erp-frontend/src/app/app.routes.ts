import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'vendas',
        loadChildren: () => import('./modules/vendas/vendas.routes').then(m => m.VENDAS_ROUTES)
      },
      {
        path: 'estoque',
        loadChildren: () => import('./modules/estoque/estoque.routes').then(m => m.ESTOQUE_ROUTES)
      },
      {
        path: 'compras',
        loadChildren: () => import('./modules/compras/compras.routes').then(m => m.COMPRAS_ROUTES)
      },
      {
        path: 'financeiro',
        loadChildren: () => import('./modules/financeiro/financeiro.routes').then(m => m.FINANCEIRO_ROUTES)
      },
      {
        path: 'security',
        loadChildren: () => import('./modules/security/security.routes').then(m => m.SECURITY_ROUTES)
      }
    ]
  },
  {
    path: 'config/empresa',
    canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/company-config/company-config.component').then(m => m.CompanyConfigComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
