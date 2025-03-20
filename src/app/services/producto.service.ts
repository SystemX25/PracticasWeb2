import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private xmlUrl = "asset/productos.xml"; // Corrige la URL

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    const xmlGuardado = localStorage.getItem('inventarioXML');
    if (xmlGuardado) {
      return of(this.parseXML(xmlGuardado));
    } else {
      return this.http.get(this.xmlUrl, { responseType: "text" }).pipe(
        map(xml => {
          const productos = this.parseXML(xml);
          localStorage.setItem('inventarioXML', xml); // Guarda en localStorage
          return productos;
        }),
        catchError(error => {
          console.error("Error cargando el XML:", error);
          return of([]); // Si hay error, retorna un array vacío
        })
      );
    }
  }

  private parseXML(xml: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    return Array.from(xmlDoc.getElementsByTagName("producto")).map(prod => ({
      id: Number(prod.getElementsByTagName("id")[0].textContent), // Convertir a número
      nombre: prod.getElementsByTagName("nombre")[0].textContent || "",
      precio: Number(prod.getElementsByTagName("precio")[0].textContent), // Convertir a número
      imagen: prod.getElementsByTagName("imagen")[0].textContent || "",
    }));
  }
}
