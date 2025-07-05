import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DRE_DTO {
  dataInicio: string;
  dataFim: string;
  receitaBrutaVendas: number;
  deducoesVendas: number;
  receitaLiquidaVendas: number;
  custoMercadoriasVendidas: number;
  lucroBruto: number;
  despesasComVendas: number;
  despesasAdministrativas: number;
  despesasFinanceiras: number;
  outrasDespesasOperacionais: number;
  totalDespesasOperacionais: number;
  lucroPrejuizoOperacional: number;
  receitasNaoOperacionais: number;
  despesasNaoOperacionais: number;
  lucroPrejuizoAntesIRCSLL: number;
  impostoRenda: number;
  contribuicaoSocial: number;
  lucroLiquidoExercicio: number;
}

export interface BalancoPatrimonialDTO {
  dataReferencia: string;
  ativoCirculante: number;
  ativoNaoCirculante: number;
  totalAtivo: number;
  passivoCirculante: number;
  passivoNaoCirculante: number;
  totalPassivo: number;
  patrimonioLiquido: number;
  totalPassivoPatrimonioLiquido: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getContasReceberReport(status?: string): Observable<any[]> {
    const url = status ? `${this.API}/contas-receber?status=${status}` : `${this.API}/contas-receber`;
    return this.http.get<any[]>(url);
  }

  getContasPagarReport(status?: string): Observable<any[]> {
    const url = status ? `${this.API}/contas-pagar?status=${status}` : `${this.API}/contas-pagar`;
    return this.http.get<any[]>(url);
  }

  getFluxoCaixaReport(dataInicio: string, dataFim: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/fluxo-caixa?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getDRE(dataInicio: string, dataFim: string): Observable<DRE_DTO> {
    return this.http.get<DRE_DTO>(`${this.API}/dre?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getBalancoPatrimonial(dataReferencia: string): Observable<BalancoPatrimonialDTO> {
    return this.http.get<BalancoPatrimonialDTO>(`${this.API}/balanco-patrimonial?dataReferencia=${dataReferencia}`);
  }
}
