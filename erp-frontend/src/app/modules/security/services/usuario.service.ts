import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Role } from '../models/role.model';

export interface Usuario {
  id?: string;
  username: string;
  email: string;
  password?: string;
  ativo: boolean;
  roles?: Role[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API);
  }

  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`);
  }

  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, usuario);
  }

  atualizar(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/${id}`, usuario);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
