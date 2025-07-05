import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CompanyConfigService } from '../../core/services/company-config.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../core/services/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: string;
  badgeType?: 'default' | 'alert';
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges, OnInit {
  @Input() userName: string = 'Administrator';
  @Input() userEmail: string = 'admin@admin.net';
  @Input() avatarUrl: string = '';
  @Input() open = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  companyName: string = 'Minha Empresa';
  companyLogo: string = '';
  isLoggedIn: boolean = false;
  private authSubscription: Subscription = new Subscription();

  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/',
      expanded: false
    },
    {
      title: 'Estoque',
      icon: 'fas fa-boxes',
      route: '/estoque/produtos',
      expanded: false,
      children: [
        { title: 'Produtos', icon: 'fas fa-box', route: '/estoque/produtos' }
      ]
    },
    {
      title: 'Vendas',
      icon: 'fas fa-cash-register',
      route: '/vendas/clientes',
      expanded: false,
      children: [
        { title: 'Clientes', icon: 'fas fa-users', route: '/vendas/clientes' },
        { title: 'PDV', icon: 'fas fa-calculator', route: '/vendas/pdv' }
      ]
    },
    {
      title: 'Compras',
      icon: 'fas fa-shopping-basket',
      route: '/compras/fornecedores',
      expanded: false,
      children: [
        { title: 'Fornecedores', icon: 'fas fa-truck', route: '/compras/fornecedores' },
        { title: 'Pedidos de Compra', icon: 'fas fa-file-invoice', route: '/compras/pedidos-compra' }
      ]
    },
    {
      title: 'Financeiro',
      icon: 'fas fa-dollar-sign',
      route: '/financeiro/contas-receber',
      expanded: false,
      children: [
        { title: 'Contas a Receber', icon: 'fas fa-hand-holding-usd', route: '/financeiro/contas-receber' },
        { title: 'Contas a Pagar', icon: 'fas fa-money-bill-wave', route: '/financeiro/contas-a-pagar' },
        { title: 'Fluxo de Caixa', icon: 'fas fa-chart-line', route: '/financeiro/fluxo-caixa' },
        { title: 'Relatórios', icon: 'fas fa-chart-pie', expanded: false, children: [
          { title: 'DRE', icon: 'fas fa-file-invoice-dollar', route: '/financeiro/relatorios/dre' },
          { title: 'Balanço Patrimonial', icon: 'fas fa-balance-scale', route: '/financeiro/relatorios/balanco-patrimonial' }
        ]}
      ]
    },
    {
      title: 'Segurança',
      icon: 'fas fa-shield-alt',
      route: '/security/usuarios',
      expanded: false,
      children: [
        { title: 'Usuários', icon: 'fas fa-user-lock', route: '/security/usuarios' }
      ]
    },
    {
      title: 'Configurações',
      icon: 'fas fa-cogs',
      route: '/config/empresa',
      expanded: false,
      children: [
        { title: 'Empresa', icon: 'fas fa-building', route: '/config/empresa' }
      ]
    }
  ];

  constructor(private router: Router, private companyConfigService: CompanyConfigService, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && changes['open'].currentValue) {
      this.expandActiveMenu();
    }
  }

  ngOnInit(): void {
    // Carrega a configuração da empresa
    this.companyConfigService.loadConfig().subscribe();
    
    this.companyConfigService.config$.subscribe(config => {
      if (config) {
        this.companyName = config.nomeEmpresa || '';
        this.companyLogo = config.logoUrl || '';
      } else {
        this.companyName = 'Minha Empresa';
        this.companyLogo = '';
      }
    });

    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.isLoggedIn = user ? user.isAuthenticated : false;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url.startsWith(route);
  }

  handleItemClick(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    } else if (item.route) {
      this.navigateTo(item.route);
    }
  }

  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  private expandActiveMenu(): void {
    const currentUrl = this.router.url;
    for (const item of this.menuItems) {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.route && currentUrl.startsWith(child.route)
        );
        if (hasActiveChild || (item.route && currentUrl.startsWith(item.route))) {
          item.expanded = true;
          break;
        }
      }
    }
  }

  expandSidebar(): void {
    this.open = true;
    this.expandActiveMenu();
  }

  collapseSidebar(): void {
    this.open = false;
  }
} 