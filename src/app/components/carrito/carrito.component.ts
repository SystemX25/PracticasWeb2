import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',  // Etiqueta para insertar este componente
  imports: [CommonModule],  // Módulos necesarios para este componente
  templateUrl: './carrito.component.html',  // Vista asociada al componente
  styleUrl: './carrito.component.css'   // Estilos asociados al componente
})
export class CarritoComponent {

  carrito: any[] = [];  // Array de productos del carrito
  constructor(private carritoService: CarritoService) { 
    this.carrito = this.carritoService.obtenerProducto();  // Obtener productos del carrito
  }  // Inyección de dependencias

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerProducto();  // Obtener productos del carrito
  }
  generarXML(){
    this.carritoService.generarXML();  // Generar XML
  }

  eliminarProducto(producto: any){
    this.carritoService.eliminarProducto(producto);  // Eliminar producto del carrito
  }
}
