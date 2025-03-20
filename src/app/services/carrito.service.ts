import { Injectable } from '@angular/core';
import {Producto} from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
 
  private  carrito: Producto[] = [];
  agregarProducto(producto: Producto){
    this.carrito.push(producto);
  }

  obtenerProducto(){
    return this.carrito;
  }
  
  generarXML() : string{
    let subtotal = 0;
    let iva = 0;
    let total = 0;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<factura>
    <productos>`;

    // Agrupar productos por ID para obtener la cantidad de cada uno

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

    iva = subtotal * 0.16; // Suponiendo un IVA del 16%
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

    const blob = new Blob([xml], {type:'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "factura.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return xml;
  }

  eliminarProducto(producto: Producto){
    this.carrito.splice(producto.id, 1);
  }
}
