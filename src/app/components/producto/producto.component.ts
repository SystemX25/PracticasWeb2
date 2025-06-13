import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  mostrarInventario: boolean = false;
  terminoBusqueda: string = '';
  mensajeAgregado: string = '';

  constructor(
    private productosService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario && usuario.id === 1) {
      this.mostrarInventario = true;
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    this.mensajeAgregado = `Agregaste "${producto.nombre}" al carrito`;

    const modal = document.getElementById('popup');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => {
        modal.style.display = 'none';
        this.mensajeAgregado = '';
      }, 30000); // 30 segundos
    }
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  irInventario(): void {
    this.router.navigate(['/inventario']);
  }

  irPedidos():void{
    this.router.navigate(['/pedidos'])
  }

  get productosFiltrados(): Producto[] {
    if (!this.terminoBusqueda.trim()) return this.productos;
    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  
irAlPerfil(): void {
  this.router.navigate(['/perfil']);
}
}
