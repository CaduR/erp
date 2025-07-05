import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioCadastroRequest {
  nomeCompleto: string;
  email: string;
  senhaProvisoria: string;
  funcao: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioCadastroFormService {
  private apiUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(request: UsuarioCadastroRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
} 