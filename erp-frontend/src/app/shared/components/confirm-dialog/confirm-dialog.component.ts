import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'save' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="confirm-dialog-overlay" (click)="onOverlayClick($event)">
      <div class="confirm-dialog" [class]="options?.type || 'info'">
        <div class="confirm-dialog-header">
          <h3 class="confirm-dialog-title">{{ options?.title || 'Confirmação' }}</h3>
          <button class="confirm-dialog-close" (click)="cancel()">×</button>
        </div>
        
        <div class="confirm-dialog-body">
          <p class="confirm-dialog-message">{{ options?.message }}</p>
        </div>
        
        <div class="confirm-dialog-footer">
          <button 
            class="btn-secondary" 
            (click)="cancel()"
          >
            {{ options?.cancelText || 'Cancelar' }}
          </button>
          <button 
            class="btn-primary" 
            [class]="options?.type || 'info'"
            (click)="confirm()"
          >
            {{ options?.confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 1rem;
    }

    .confirm-dialog {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 100%;
      animation: slideIn 0.3s ease-out;
    }

    .confirm-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0 1.5rem;
    }

    .confirm-dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    .confirm-dialog-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .confirm-dialog-close:hover {
      background: #f0f0f0;
      color: #333;
    }

    .confirm-dialog-body {
      padding: 1rem 1.5rem;
    }

    .confirm-dialog-message {
      margin: 0;
      color: #666;
      line-height: 1.5;
      font-size: 1rem;
    }

    .confirm-dialog-footer {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 2px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn-primary {
      color: white;
    }

    .btn-primary.delete {
      background: #dc3545;
    }

    .btn-primary.delete:hover {
      background: #c82333;
    }

    .btn-primary.save {
      background: #28a745;
    }

    .btn-primary.save:hover {
      background: #218838;
    }

    .btn-primary.warning {
      background: #ffc107;
      color: #333;
    }

    .btn-primary.warning:hover {
      background: #e0a800;
    }

    .btn-primary.info {
      background: #17a2b8;
    }

    .btn-primary.info:hover {
      background: #138496;
    }

    @keyframes slideIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .confirm-dialog {
        margin: 1rem;
      }
      
      .confirm-dialog-footer {
        flex-direction: column;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() show = false;
  @Input() options?: ConfirmDialogOptions;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }
} 