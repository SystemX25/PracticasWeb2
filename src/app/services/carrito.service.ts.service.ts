import { Injectable } from '@angular/core';
import { Producto } from "../models/producto";

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  agregarProducto(producto: Producto) {
    this.carrito.push(producto);
  }

  obtenerProductos() {
    return this.carrito;
  }

  constructor() { }

  generarXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Recibo>\n';

    // Agrupar productos por ID y calcular cantidades
    let productosMap = new Map<number, { producto: Producto, cantidad: number }>();
    this.carrito.forEach(producto => {
      if (productosMap.has(producto.id)) {
        productosMap.get(producto.id)!.cantidad++;
      } else {
        productosMap.set(producto.id, { producto, cantidad: 1 });
      }
    });

    let subtotal = 0;

    productosMap.forEach(({ producto, cantidad }) => {
      let precioTotal = producto.precio * cantidad;
      subtotal += precioTotal;

      xml += `
      <producto id="${producto.id}">
        <nombre>${producto.nombre}</nombre>
        <cantidad>${cantidad}</cantidad>
        <precio_unitario>${producto.precio.toFixed(2)}</precio_unitario>
        <precio_total>${precioTotal.toFixed(2)}</precio_total>
      </producto>`;
    });

    let iva = subtotal * 0.16;
    let total = subtotal + iva;

    xml += `
    <Subtotal>${subtotal.toFixed(2)}</Subtotal>
    <IVA>${iva.toFixed(2)}</IVA>
    <Total>${total.toFixed(2)}</Total>
    </Recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
  }
}
