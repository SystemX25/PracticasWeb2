import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {
  private apiUrl = 'http://localhost:3000/api/usuarios/recuperar';

  constructor(private http: HttpClient) {}

  recuperar(nombre: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nombre });
  }
}
