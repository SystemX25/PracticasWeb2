import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user'; // Base URL

  constructor(private http: HttpClient) {}

  // Headers reusable
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Puedes añadir más headers comunes aquí, como Authorization si usas JWT
    });
  }

  login(nombre: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { // Cambiado a ${this.apiUrl} en lugar de ${this.apiUrl}/user
      params: { nombre, password },
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name,
      email,
      password
    }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para reset de contraseña
  resetPassword(userId: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      userId,
      token,
      nuevaContrasena: newPassword
    }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para solicitar recuperación
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, {
      correo_electronico: email
    }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo centralizado de errores
  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'Ocurrió un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado servidor
      if (error.status === 0) {
        errorMessage = 'No hay conexión con el servidor';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}