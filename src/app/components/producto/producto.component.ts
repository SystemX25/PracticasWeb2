import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  mostrarInventario: boolean = false; // <- NUEVA propiedad

  constructor(
    private productosService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener productos
    this.productosService.obtenerProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });

    // Verificar usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Ejemplo: mostrar inventario solo si el usuario tiene ID 1
    if (usuario && usuario.id === 2) {
      this.mostrarInventario = true;
    }

    // Otra opción: mostrar si tiene rol "admin"
    // this.mostrarInventario = usuario?.rol === 'admin';
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  irInventario(): void {
    this.router.navigate(['/inventario']);
  }
}
