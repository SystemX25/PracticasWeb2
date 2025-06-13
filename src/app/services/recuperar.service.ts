import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {
  private apiUrl = 'http://localhost:3000/api/user/recuperar';
  private resetUrl = 'http://localhost:3000/api/user/reset-password';

  constructor(private http: HttpClient) {}

  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { 
      correo_electronico: email 
    });
  }

  resetearContrasena(token: string, nuevaContrasena: string): Observable<any> {
    return this.http.post<any>(this.resetUrl, { 
      token,
      nuevaContrasena 
    });
  }

  validarToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.resetUrl}/${token}`);
  }
}