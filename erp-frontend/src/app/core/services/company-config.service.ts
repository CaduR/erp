import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyConfig {
  id?: number;
  nomeEmpresa: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyConfigService {
  private readonly API_URL = `${environment.apiUrl}/configuracao-empresa`;
  private configSubject = new BehaviorSubject<CompanyConfig | null>(null);
  public config$: Observable<CompanyConfig | null> = this.configSubject.asObservable();

  constructor(private http: HttpClient) {
    // Removido o carregamento automático no construtor
  }

  loadConfig(): Observable<CompanyConfig | null> {
    return this.http.get<CompanyConfig>(this.API_URL).pipe(
      tap({
        next: (config) => this.configSubject.next(config),
        error: (err) => {
          console.error('Erro ao carregar configuração da empresa do backend:', err);
          this.configSubject.next(null); // Define como nulo em caso de erro
        }
      })
    );
  }

  updateConfig(config: CompanyConfig): Observable<CompanyConfig> {
    return this.http.put<CompanyConfig>(this.API_URL, config).pipe(
      tap(updatedConfig => this.configSubject.next(updatedConfig))
    );
  }

  getConfig(): Observable<CompanyConfig | null> {
    return this.config$;
  }

  // Métodos de conveniência (podem ser removidos ou adaptados conforme a necessidade)
  getCompanyName(): string {
    return this.configSubject.value?.nomeEmpresa || '';
  }

  getCompanyLogo(): string {
    return this.configSubject.value?.logoUrl || '';
  }
}
 