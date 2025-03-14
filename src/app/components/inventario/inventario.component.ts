import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  modoEdicion = false;
  
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    precio: 0,
    cantidad: 0,
    imagen: ''
  };

  constructor(
    private inventarioService: InventarioService, 
    private router:Router) {}

  ngOnInit(): void {
    this.inventarioService.productos$.subscribe(productos => {
      this.productos = productos;
    });
  }

  agregarProducto(): void {
    if (this.validarProducto(this.nuevoProducto)) {
      this.inventarioService.agregarProducto({...this.nuevoProducto});
      this.resetearFormulario();
    }
  }

  irAProductos() {
    this.router.navigate(['/']);
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = {...producto};
    this.modoEdicion = true;
  }

  actualizarProducto(): void {
    if (this.productoSeleccionado && this.validarProducto(this.productoSeleccionado)) {
      this.inventarioService.actualizarProducto(this.productoSeleccionado);
      this.cancelarEdicion();
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.inventarioService.eliminarProducto(id);
      if (this.productoSeleccionado?.id === id) {
        this.cancelarEdicion();
      }
    }
  }

  cancelarEdicion(): void {
    this.productoSeleccionado = null;
    this.modoEdicion = false;
  }

  resetearFormulario(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: 0,
      cantidad: 0,
      imagen: ''
    };
  }

  private validarProducto(producto: Producto): boolean {
    return !!producto.nombre && producto.precio > 0;
  }
}