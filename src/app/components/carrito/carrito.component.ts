import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carritoAgrupado: any[] = [];  // Aquí se almacenan los productos agrupados

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.agruparProductos();
  }

  agruparProductos() {
    const carrito = this.carritoService.obtenerProducto();
    const agrupado: { [id: string]: any } = {};  
  
    carrito.forEach(producto => {
      if (agrupado[producto.id]) {
        agrupado[producto.id].cantidad++;
        agrupado[producto.id].precioTotal = producto.precio * agrupado[producto.id].cantidad;
      } else {
        agrupado[producto.id] = { 
          ...producto, 
          cantidad: 1, 
          precioTotal: producto.precio // Nuevo campo que mantiene el precio total
        };
      }
    });
  
    this.carritoAgrupado = Object.values(agrupado);
  }

  generarXML() {
    this.carritoService.generarXML();
  }

  eliminarProducto(id: number) {
    this.carritoService.eliminarProducto(id);
    this.agruparProductos();  // Recalcular agrupación después de eliminar
  }

  agregarProducto(producto: any) {
    this.carritoService.agregarProducto(producto);
    this.agruparProductos();  // Recalcular agrupación después de agregar
  }
}
