import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ContaReceber {
  id: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  clienteId: number;
  clienteNome: string;
  vendaId?: number;
}

export interface ContaReceberRequest {
  descricao: string;
  valor: number;
  dataVencimento: string;
  clienteId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContasReceberService {

  constructor(private http: HttpClient) {}

  listar(): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${environment.apiUrl}/contas-receber`);
  }

  buscarPorId(id: number): Observable<ContaReceber> {
    return this.http.get<ContaReceber>(`${environment.apiUrl}/contas-receber/${id}`);
  }

  criar(conta: ContaReceberRequest): Observable<ContaReceber> {
    return this.http.post<ContaReceber>(`${environment.apiUrl}/contas-receber`, conta);
  }

  atualizar(id: number, conta: ContaReceberRequest): Observable<ContaReceber> {
    return this.http.put<ContaReceber>(`${environment.apiUrl}/contas-receber/${id}`, conta);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/contas-receber/${id}`);
  }

  marcarComoPaga(id: number): Observable<ContaReceber> {
    return this.http.post<ContaReceber>(`${environment.apiUrl}/contas-receber/${id}/pagar`, {});
  }

  buscarPorStatus(status: string): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${environment.apiUrl}/contas-receber/status/${status}`);
  }

  buscarPorCliente(clienteId: number): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${environment.apiUrl}/contas-receber/cliente/${clienteId}`);
  }
}
