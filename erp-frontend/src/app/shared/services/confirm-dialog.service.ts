import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'save' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private confirmSubject = new Subject<ConfirmDialogData>();
  public confirm$ = this.confirmSubject.asObservable();

  private resultSubject = new Subject<boolean>();

  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.confirmSubject.next(data);
    return new Promise((resolve) => {
      this.resultSubject.subscribe((result) => {
        resolve(result);
      });
    });
  }

  confirmDelete(message: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirmar Exclusão',
      message,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'delete'
    });
  }

  confirmSave(message: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirmar Salvamento',
      message,
      confirmText: 'Salvar',
      cancelText: 'Cancelar',
      type: 'save'
    });
  }

  setResult(result: boolean): void {
    this.resultSubject.next(result);
  }
} 