import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface NotaFiscal {
  id?: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  status: 'PENDENTE' | 'EMITIDA' | 'CANCELADA' | 'ERRO';
  chaveAcesso?: string;
  linkDanfe?: string;
  xmlContent?: string;
  vendaId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private readonly API = `${environment.apiUrl}/notas-fiscais`;

  constructor(private http: HttpClient) { }

  emitirNota(vendaId: string): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(`${this.API}/emitir/${vendaId}`, {});
  }

  buscarPorVendaId(vendaId: string): Observable<NotaFiscal> {
    return this.http.get<NotaFiscal>(`${this.API}/venda/${vendaId}`);
  }

  listar(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.API);
  }
}
