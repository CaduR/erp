import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService, User } from './core/services/auth.service';
import { LoadingService } from './shared/services/loading.service';
import { ToastService, Toast } from './shared/services/toast.service';
import { CommonModule, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, NgClass],
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="showSidebar" [open]="sidebarOpen" (toggleSidebar)="toggleSidebar()"></app-sidebar>
      <div class="main-content" [class.sidebar-expanded]="sidebarOpen && showSidebar">
        <div class="main-toolbar" *ngIf="showSidebar">
          <input class="global-search" type="search" placeholder="Buscar no sistema..." aria-label="Buscar no sistema" />
          <div class="quick-actions">
            <button class="quick-btn" aria-label="Novo cadastro">➕</button>
            <button class="quick-btn" aria-label="Notificações"><span class="notif-icon">🔔</span><span class="notif-badge">2</span></button>
          </div>
        </div>
        <div *ngIf="loading" class="loader-overlay" aria-live="polite" aria-busy="true">
          <div class="loader"></div>
        </div>
        <main class="app-main" tabindex="0">
          <router-outlet></router-outlet>
        </main>
        <footer class="app-footer" *ngIf="showSidebar">
          <p>&copy; 2024 Sistema ERP - Desenvolvido com Angular e Spring Boot</p>
        </footer>
        <div *ngFor="let toast of toasts" class="toast" [ngClass]="toast.type" role="status" aria-live="polite">{{ toast.message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding: 1rem;
      background: var(--background-main);
      transition: margin-left 0.3s ease;
      margin-left: 0; /* Largura inicial da sidebar */
    }
    .main-content.sidebar-expanded {
      margin-left: 250px; /* Largura expandida da sidebar */
    }
    .main-content:not(.sidebar-expanded) {
      margin-left: 60px; /* Largura inicial da sidebar quando não expandida */
    }
    .main-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--background-card);
      border-bottom: 1px solid var(--border-color);
      margin-bottom: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
    }
    .global-search {
      flex-grow: 1;
      margin-right: var(--spacing-md);
      max-width: 400px;
    }
    .quick-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
    .quick-btn {
      background: var(--background-main);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-sm);
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        background: var(--primary-color-hover);
        color: white;
      }
    }
    .notif-icon {
      position: relative;
    }
    .notif-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--error-color);
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.7em;
    }
    .app-footer {
      text-align: center;
      padding: var(--spacing-md);
      color: var(--text-color-light);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-lg);
    }
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loader {
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .toast {
      position: fixed;
      bottom: var(--spacing-lg);
      right: var(--spacing-lg);
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      color: white;
      font-weight: var(--font-weight-bold);
      box-shadow: var(--shadow);
      z-index: 10000;
    }
    .toast.success {
      background-color: var(--accent-color);
    }
    .toast.error {
      background-color: var(--error-color);
    }
    .toast.warning {
      background-color: var(--warning-color);
      color: var(--text-color);
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'erp-frontend';
  sidebarOpen: boolean = false;
  loading: boolean = false;
  toasts: Toast[] = [];
  showSidebar: boolean = false;

  private loadingSubscription: Subscription = new Subscription();
  private toastSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
      this.loading = isLoading;
    });

    this.toastSubscription = this.toastService.toasts$.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });

    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.updateSidebarVisibility(user);
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSidebarVisibility(this.authService.getCurrentUserValue());
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.toastSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Inicializar a visibilidade da sidebar após a inicialização completa da view
    setTimeout(() => {
      this.updateSidebarVisibility(this.authService.getCurrentUserValue());
    }, 0);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private updateSidebarVisibility(user: User | null): void {
    const isLoginPage = this.router.url.includes('/login');
    const newShowSidebar = !!(user && user.isAuthenticated && !isLoginPage);
    
    this.showSidebar = newShowSidebar;
    if (!this.showSidebar) {
      this.sidebarOpen = false; // Garante que a sidebar esteja fechada se não for para aparecer
    }
  }
}
