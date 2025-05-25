import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {
  private apiUrl = 'http://localhost:3000/api/user/recuperar';

  constructor(private http: HttpClient) {}

  recuperarContrasena(nombre: string, email: string): Observable<any> {
    console.log('Enviando:', { nombre, email }); // Agrega esto
    return this.http.post<any>(this.apiUrl, { 
      nombre,
      correo_electronico: email 
    });
  }
}