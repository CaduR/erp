import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContaPagar {
  id?: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // ou Date, dependendo da necessidade
  dataPagamento?: string; // ou Date
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  fornecedorId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContaPagarService {
  private readonly API = 'http://localhost:8080/api/contas-a-pagar';

  constructor(private http: HttpClient) { }

  listar(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(this.API);
  }

  buscarPorId(id: string): Observable<ContaPagar> {
    return this.http.get<ContaPagar>(`${this.API}/${id}`);
  }

  criar(conta: ContaPagar): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(this.API, conta);
  }

  atualizar(id: string, conta: ContaPagar): Observable<ContaPagar> {
    return this.http.put<ContaPagar>(`${this.API}/${id}`, conta);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  pagar(id: string): Observable<ContaPagar> {
    return this.http.patch<ContaPagar>(`${this.API}/${id}/pagar`, {});
  }
}
