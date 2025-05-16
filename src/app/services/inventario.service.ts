import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(private productoService: ProductoService) { 
    this.cargarProductos();
  }

  private cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => this.productosSubject.next(productos),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  getProductos(): Producto[] {
    return this.productosSubject.getValue();
  }

  agregarProducto(producto: Producto) {
    this.productoService.agregarProducto(producto).pipe(
      tap(() => this.cargarProductos())
    ).subscribe({
      next: () => console.log('Producto agregado'),
      error: (err) => console.error('Error al agregar producto', err)
    });
  }

  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).pipe(
      tap(() => this.cargarProductos())
    ).subscribe({
      next: () => console.log('Producto eliminado'),
      error: (err) => console.error('Error al eliminar producto', err)
    });
  }

  generarXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<inventario>\n`;
    this.productosSubject.getValue().forEach(p => {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.nombre}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      xml += `    <imagen>${p.imagen}</imagen>\n`;
      xml += `  </producto>\n`;
    });
    xml += `</inventario>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventario.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
