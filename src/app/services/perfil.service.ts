import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/user'; 

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${id}`);
  }

  actualizarPerfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/${id}`, data);
  }
}