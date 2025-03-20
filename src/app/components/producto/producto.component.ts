import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-producto',//identificador de la etiqueta de mi componente 
  imports: [CommonModule],
  templateUrl: './producto.component.html',//asignamos la vista del componente
  styleUrl: './producto.component.css'//corchetes mas de una hoja de estilos
})
export class ProductoComponent implements OnInit {
  productos! : Observable<Producto[]>;
  constructor(private productosService : ProductoService, private carritoService : CarritoService, private router : Router) { }
  ngOnInit(): void {
      this.productos = this.productosService.obtenerProductos();
  }

  agregarAlCarrito(producto: any){
    this.carritoService.agregarProducto(producto);
  }

  irAlCarrito(){
    this.router.navigate(['/carrito']);
  }

  irInventario(){
    this.router.navigate(['inventario']);
  }
} 
