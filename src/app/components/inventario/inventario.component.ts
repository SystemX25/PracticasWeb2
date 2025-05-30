import { Component } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {

  nuevoProducto: Producto = { id: 0, nombre: '', precio: 0, imagen: '' };

   constructor(
    public inventarioService: InventarioService,
    private router: Router
  ) {}

  agregarProducto() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert("Por favor, ingrese un nombre y un precio válido.");
      return;
    }

    this.inventarioService.agregarProducto(this.nuevoProducto);
    this.nuevoProducto = { id: 0, nombre: '', precio: 0, imagen: '' };
  }

  eliminarProducto(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.inventarioService.eliminarProducto(id);
    }
  }

  guardarStock(id: number, stock: number | undefined) {
    if (stock === undefined) {
    console.error('El stock es undefined');
    return;
  }

  // Aquí ya es seguro usar `stock` como number
  this.inventarioService.guardarStock(id, stock);
  }

  descargarXML() {
    this.inventarioService.generarXML();
  }

  irAProducto() {
    this.router.navigate(['']);
  }
}