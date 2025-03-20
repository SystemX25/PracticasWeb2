import { Component } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  productos$: Observable<Producto[]>; // Observables para productos

  nuevoProducto: Producto = { id: 0, nombre: '', precio: 0, imagen: '' };

  constructor(public inventarioService: InventarioService) {
    this.productos$ = this.inventarioService.productos$; // Asignación dentro del constructor
  }

  agregarProducto() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert("Por favor, ingrese un nombre y un precio válido.");
      return;
    }

    const nuevoProducto: Producto = {
      id: this.nuevoProducto.id,
      nombre: this.nuevoProducto.nombre,
      precio: this.nuevoProducto.precio,
      imagen: this.nuevoProducto.imagen || 'https://via.placeholder.com/150'
    };

    this.inventarioService.agregarProducto(nuevoProducto);

    // Reiniciar formulario
    this.nuevoProducto = { id: 0, nombre: '', precio: 0, imagen: '' };
  }

  eliminarProducto(id: number) {
    this.inventarioService.eliminarProducto(id);
  }

  descargarXML() {
    this.inventarioService.generarXML();
  }
}

