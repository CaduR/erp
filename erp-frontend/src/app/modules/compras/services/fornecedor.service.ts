import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fornecedor {
  id?: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
}

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private readonly API = 'http://localhost:8080/api/fornecedores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.API);
  }

  buscarPorId(id: string): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.API}/${id}`);
  }

  criar(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.API, fornecedor);
  }

  atualizar(id: string, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.API}/${id}`, fornecedor);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
