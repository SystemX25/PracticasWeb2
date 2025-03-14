import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service.ts.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})

export class ProductoComponent implements OnInit {
  public productos: Producto[] = [];
  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router:Router
  ) { }
  async ngOnInit() {
    this.productos = await lastValueFrom(this.productoService.obtenerProducto()).then((prods) => prods);
  }

  agregarAlCarrito(producto:any) {
    this.carritoService.agregarProducto(producto);
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAlInventario() {
    this.router.navigate(['/inventario']);
  }
}