import { Routes } from '@angular/router';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
    { path: '', redirectTo: 'productos', pathMatch: 'full' }, // Redirige a /productos por defecto
    { path: 'productos', component: ProductoComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: '**', redirectTo: 'productos' } // Redirige rutas desconocidas
];
