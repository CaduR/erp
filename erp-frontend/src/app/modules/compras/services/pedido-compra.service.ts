import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Produto } from '../../estoque/services/produto.service';
import { Fornecedor } from './fornecedor.service';

export interface PedidoCompraItem {
  produtoId: string;
  produto?: Produto; // Opcional, para uso no frontend
  quantidade: number;
  valorUnitario: number;
}

export interface PedidoCompra {
  id?: string;
  fornecedorId: string;
  fornecedor?: Fornecedor; // Opcional, para uso no frontend
  dataPedido: string; // ou Date
  status: 'PENDENTE' | 'APROVADO' | 'CANCELADO' | 'RECEBIDO_PARCIAL' | 'RECEBIDO_TOTAL';
  itens: PedidoCompraItem[];
  valorTotal?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraService {
  private readonly API = `${environment.apiUrl}/pedidos-compra`;

  constructor(private http: HttpClient) { }

  listar(): Observable<PedidoCompra[]> {
    return this.http.get<PedidoCompra[]>(this.API).pipe(
      catchError(this.handleError)
    );
  }

  buscarPorId(id: string): Observable<PedidoCompra> {
    return this.http.get<PedidoCompra>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  criar(pedido: PedidoCompra): Observable<PedidoCompra> {
    return this.http.post<PedidoCompra>(this.API, pedido).pipe(
      catchError(this.handleError)
    );
  }

  atualizar(id: string, pedido: PedidoCompra): Observable<PedidoCompra> {
    return this.http.put<PedidoCompra>(`${this.API}/${id}`, pedido).pipe(
      catchError(this.handleError)
    );
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  aprovar(id: string): Observable<PedidoCompra> {
    return this.http.patch<PedidoCompra>(`${this.API}/${id}/aprovar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  cancelar(id: string): Observable<PedidoCompra> {
    return this.http.patch<PedidoCompra>(`${this.API}/${id}/cancelar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Método para simular o recebimento de mercadorias
  receberMercadorias(id: string, itensRecebidos: { produtoId: string, quantidade: number }[]): Observable<PedidoCompra> {
    return this.http.patch<PedidoCompra>(`${this.API}/${id}/receber`, itensRecebidos).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Ocorreu um erro!', error);
    return throwError(() => new Error('Ocorreu um erro na chamada da API. Tente novamente mais tarde.'));
  }
}
