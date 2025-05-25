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

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name,
      email,
      password
    }, {
      headers: { 'Content-Type': 'application/json' }  // ¡Importante!
    });
  }
}
