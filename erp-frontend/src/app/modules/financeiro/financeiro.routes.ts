import { Routes } from '@angular/router';

export const FINANCEIRO_ROUTES: Routes = [
  {
    path: 'contas-receber',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/contas-receber-list/contas-receber-list.component').then(m => m.ContasReceberListComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/conta-receber-form/conta-receber-form.component').then(m => m.ContaReceberFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/conta-receber-form/conta-receber-form.component').then(m => m.ContaReceberFormComponent)
      }
    ]
  },
  {
    path: 'contas-a-pagar',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/conta-pagar-list/conta-pagar-list.component').then(m => m.ContaPagarListComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/conta-pagar-form/conta-pagar-form.component').then(m => m.ContaPagarFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/conta-pagar-form/conta-pagar-form.component').then(m => m.ContaPagarFormComponent)
      }
    ]
  },
  {
    path: 'fluxo-caixa',
    loadComponent: () => import('./pages/fluxo-caixa-list/fluxo-caixa-list.component').then(m => m.FluxoCaixaListComponent)
  },
  {
    path: 'relatorios',
    children: [
      {
        path: 'contas-receber',
        loadComponent: () => import('./pages/contas-receber-report/contas-receber-report.component').then(m => m.ContasReceberReportComponent)
      },
      {
        path: 'contas-pagar',
        loadComponent: () => import('./pages/contas-pagar-report/contas-pagar-report.component').then(m => m.ContasPagarReportComponent)
      },
      {
        path: 'fluxo-caixa',
        loadComponent: () => import('./pages/fluxo-caixa-report/fluxo-caixa-report.component').then(m => m.FluxoCaixaReportComponent)
      },
      {
        path: 'dre',
        loadComponent: () => import('./pages/dre-report/dre-report.component').then(m => m.DreReportComponent)
      },
      {
        path: 'balanco-patrimonial',
        loadComponent: () => import('./pages/balanco-patrimonial-report/balanco-patrimonial-report.component').then(m => m.BalancoPatrimonialReportComponent)
      }
    ]
  }
];