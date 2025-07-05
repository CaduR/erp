import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalProdutos: number;
  produtosEstoqueBaixo: number;
  totalClientes: number;
  totalFornecedores: number;
  contasReceberAbertas: number;
  valorContasReceberAbertas: number;
  contasPagarAbertas: number;
  valorContasPagarAbertas: number;
  vendasHoje: number;
  vendasMes: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/dashboard/stats`;

  constructor(private http: HttpClient) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.API_URL);
  }
}
