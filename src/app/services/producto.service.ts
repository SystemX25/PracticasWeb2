import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    new Producto(1, 'Laptop', 1200, 'https://via.placeholder.com/150'),
    new Producto(2, 'Mouse', 20, 'https://via.placeholder.com/150'),
    new Producto(3, 'Teclado', 30, 'https://via.placeholder.com/150'),
  ];
  obtenerProductos(): Producto[] {
    return this.productos;
  }
}
