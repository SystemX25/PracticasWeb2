import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://localhost:3000/api/pedidos'; // Ajusta tu URL real

    constructor(private http: HttpClient) {}

    obtenerPedidosPorUsuario(usuarioId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}?user=${usuarioId}`);
    }
    // pedido.service.ts
    guardarPedido(pedido: any): Observable<any> {
      console.log(pedido);
      return this.http.post(`${this.apiUrl}`, pedido);
    }
}
