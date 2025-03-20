import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(private productoService: ProductoService) { 
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productosSubject.next(productos);
    });
  }

  getProductos(): Producto[] {
    return this.productosSubject.getValue();
  }

  agregarProducto(producto: Producto) {
    const nuevosProductos = [...this.getProductos(), producto];
    this.productosSubject.next(nuevosProductos);
    this.generarXML();
  }

  eliminarProducto(id: number) {
    const nuevosProductos = this.getProductos().filter(p => p.id !== id);
    this.productosSubject.next(nuevosProductos);
    this.generarXML();
  }

  generarXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<inventario>\n`;
    this.getProductos().forEach(p => {
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

    localStorage.setItem('inventarioXML', xml);
  }
}
