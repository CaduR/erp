import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface VendaItem {
  produtoId: string;
  quantidade: number;
}

export interface VendaRequest {
  clienteId: string;
  itens: VendaItem[];
}

export interface VendaResponse {
  id: string;
  clienteId: string;
  clienteNome: string;
  dataVenda: string;
  valorTotal: number;
  notaFiscalId?: string; // Adicionado
  notaFiscalStatus?: 'PENDENTE' | 'EMITIDA' | 'CANCELADA' | 'ERRO'; // Adicionado
  linkDanfe?: string; // Adicionado
  itens: {
    produtoId: string;
    produtoNome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class VendaService {
  private readonly API = `${environment.apiUrl}/vendas`;

  constructor(private http: HttpClient) {}

  criarVenda(venda: VendaRequest): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(this.API, venda).pipe(
      catchError(this.handleError)
    );
  }

  listarVendas(): Observable<VendaResponse[]> {
    return this.http.get<VendaResponse[]>(this.API).pipe(
      catchError(this.handleError)
    );
  }

  buscarVendaPorId(id: string): Observable<VendaResponse> {
    return this.http.get<VendaResponse>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Ocorreu um erro!', error);
    return throwError(() => new Error('Ocorreu um erro na chamada da API. Tente novamente mais tarde.'));
  }
}
