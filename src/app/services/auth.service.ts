import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user'; // Cambia esto

  constructor(private http: HttpClient) {}

  login(nombre: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, {
      params: { nombre, password }
    });
  }

  register(nombre: string, correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      nombre,
      correo,
      password
    });
}
}
