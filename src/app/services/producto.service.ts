import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private xmlUrl = 'assets/productos.xml'; 

  constructor(private http: HttpClient) { }

  // Obtener productos desde el XML
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(map((xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const productos = Array.from(xmlDoc.getElementsByTagName('producto')).map(
        prod => ({
          id: parseInt(prod.getElementsByTagName('id')[0].textContent || '0', 10),
          nombre: prod.getElementsByTagName('nombre')[0].textContent || '',
          precio: parseFloat(prod.getElementsByTagName('precio')[0].textContent || '0'),
          imagen: prod.getElementsByTagName('imagen')[0].textContent || ''
        })
      );
      return productos;
    }));
  }
}