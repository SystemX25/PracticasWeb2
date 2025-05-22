import { Routes } from '@angular/router';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: "inventario", component: InventarioComponent},
    {path: 'productos', component: ProductoComponent},
    {path: 'register', component: RegisterComponent},

];
