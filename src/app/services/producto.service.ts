import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Producto } from '../models/producto'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private xmlUrl = 'assets/productos.xml';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarStock(id: number, stock: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { stock });
  }

  private obtenerDesdeXML(): Observable<any[]> {
    const xmlGuardado = localStorage.getItem('inventarioXML');
    if (xmlGuardado) {
      return of(this.parseXML(xmlGuardado));
    } else {
      return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
        map(xml => {
          const productos = this.parseXML(xml);
          localStorage.setItem('inventarioXML', xml);
          return productos;
        }),
        catchError(error => {
          console.error("Error cargando el XML:", error);
          return of([]);
        })
      );
    }
  }

  

  private parseXML(xml: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    return Array.from(xmlDoc.getElementsByTagName("producto")).map(prod => ({
      id: Number(prod.getElementsByTagName("id")[0].textContent),
      nombre: prod.getElementsByTagName("nombre")[0].textContent || "",
      precio: Number(prod.getElementsByTagName("precio")[0].textContent),
      imagen: prod.getElementsByTagName("imagen")[0].textContent || "",
    }));
  }
}