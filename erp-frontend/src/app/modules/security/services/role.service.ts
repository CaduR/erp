import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Role[]> {
    return this.http.get<Role[]>(this.API);
  }

  buscarPorId(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API}/${id}`);
  }
}
