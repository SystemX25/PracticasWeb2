import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service.ts.service';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: any[] = [];
  constructor(private carritoService: CarritoService) { }
  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerProductos();
  }
  generarXML(){
    return this.carritoService.generarXML();
  }

  eliminarProducto(index: number): void {
    this.carritoService.eliminarProducto(index);
    this.carrito = this.carritoService.obtenerProductos();  
  }
}