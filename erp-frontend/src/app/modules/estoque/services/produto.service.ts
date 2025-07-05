// --- Arquivo: erp-frontend/src/app/modules/estoque/services/produto.service.ts ---
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Definindo uma interface para o nosso objeto Produto no frontend
export interface Produto {
  id?: string;
  codigo: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque: number;
  quantidadeMinima: number;
  categoria: string;
  unidadeMedida: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly API_URL = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) { }

  // Buscar todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  // Buscar produto por ID
  getProduto(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Criar novo produto
  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API_URL, produto).pipe(
      catchError(this.handleError)
    );
  }

  // Atualizar produto
  updateProduto(id: string, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API_URL}/${id}`, produto).pipe(
      catchError(this.handleError)
    );
  }

  // Deletar produto (soft delete)
  deleteProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  importProdutos(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API_URL}/import`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Ocorreu um erro!', error);
    return throwError(() => new Error('Ocorreu um erro na chamada da API. Tente novamente mais tarde.'));
  }
}
