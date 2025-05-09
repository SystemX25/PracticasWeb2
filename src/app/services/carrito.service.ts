import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  agregarProducto(producto: Producto): void {
    this.carrito.push(producto);
  }

  obtenerProducto(): Producto[] {
    return [...this.carrito];
  }

  eliminarProducto(id: number): void {
    const index = this.carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
      this.carrito.splice(index, 1);
    }
  }

  limpiarCarrito(): void {
    this.carrito = [];
  }

  generarXML(): string {
    let subtotal = 0;
    let iva = 0;
    let total = 0;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<factura>
    <productos>`;

    let productosAgrupados: { [key: string]: { descripcion: string, precioUnitario: number, cantidad: number } } = {};
    
    this.carrito.forEach((producto) => {
        subtotal += producto.precio;

        if (productosAgrupados[producto.id]) {
            productosAgrupados[producto.id].cantidad++;
        } else {
            productosAgrupados[producto.id] = { 
                descripcion: producto.nombre, 
                precioUnitario: producto.precio, 
                cantidad: 1 
            };
        }
    });

    iva = subtotal * 0.16;
    total = subtotal + iva;

    Object.keys(productosAgrupados).forEach((id) => {
        const producto = productosAgrupados[id];
        xml += `
        <producto>
            <id>${id}</id>
            <descripcion>${producto.descripcion}</descripcion>
            <cantidad>${producto.cantidad}</cantidad>
            <precioUnitario>${producto.precioUnitario.toFixed(2)}</precioUnitario>
            <subtotal>${(producto.cantidad * producto.precioUnitario).toFixed(2)}</subtotal>
        </producto>`;
    });

    xml += `
    </productos>
    
    <totales>
        <subtotal>${subtotal.toFixed(2)}</subtotal>
        <impuestos>
            <iva>${iva.toFixed(2)}</iva>
        </impuestos>
        <total>${total.toFixed(2)}</total>
    </totales>
</factura>`;

    this.descargarArchivo(xml, "factura.xml");
    return xml;
  }

  private descargarArchivo(contenido: string, nombreArchivo: string): void {
    const blob = new Blob([contenido], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}