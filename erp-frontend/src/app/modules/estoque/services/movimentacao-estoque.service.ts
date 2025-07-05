import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MovimentacaoEstoque {
  id?: string;
  produtoId: string;
  dataHora: string;
  tipo: 'ENTRADA_COMPRA' | 'SAIDA_VENDA' | 'AJUSTE_ENTRADA' | 'AJUSTE_SAIDA' | 'TRANSFERENCIA_ENTRADA' | 'TRANSFERENCIA_SAIDA';
  quantidade: number;
  referenciaOperacao?: string;
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoEstoqueService {
  private readonly API = `${environment.apiUrl}/movimentacoes-estoque`;

  constructor(private http: HttpClient) { }

  buscarMovimentacoesPorProduto(produtoId: string): Observable<MovimentacaoEstoque[]> {
    return this.http.get<MovimentacaoEstoque[]>(`${this.API}/produto/${produtoId}`);
  }
}
