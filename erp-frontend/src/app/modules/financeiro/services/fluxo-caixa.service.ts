import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LancamentoCaixa {
  id?: string;
  data: string; // Data do lançamento
  descricao: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  origemId?: string; // ID da venda, conta a pagar, etc.
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FluxoCaixaService {
  private readonly API = 'http://localhost:8080/api/fluxo-caixa';

  constructor(private http: HttpClient) { }

  listar(): Observable<LancamentoCaixa[]> {
    return this.http.get<LancamentoCaixa[]>(this.API);
  }

  // Pode-se adicionar filtros por período, tipo, etc.
  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<LancamentoCaixa[]> {
    return this.http.get<LancamentoCaixa[]>(`${this.API}?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  buscarPorId(id: string): Observable<LancamentoCaixa> {
    return this.http.get<LancamentoCaixa>(`${this.API}/${id}`);
  }

  criar(lancamento: LancamentoCaixa): Observable<LancamentoCaixa> {
    return this.http.post<LancamentoCaixa>(this.API, lancamento);
  }

  atualizar(id: string, lancamento: LancamentoCaixa): Observable<LancamentoCaixa> {
    return this.http.put<LancamentoCaixa>(`${this.API}/${id}`, lancamento);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getSaldoAtual(): Observable<number> {
    return this.http.get<number>(`${this.API}/saldo`);
  }
}
