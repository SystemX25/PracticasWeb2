import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service.ts.service';

@Component({
  selector: 'app-producto',
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [CommonModule], // Agrega CommonModule aquí
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  public productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  agregarACarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    alert('Producto agregado al carrito');
  }

  irACarrito(): void {
    this.router.navigate(['/carrito']);
  }
}