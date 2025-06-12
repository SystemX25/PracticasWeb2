import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecuperarService } from '../../services/recuperar.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  standalone: true,
  styleUrls: ['./recuperar.component.css'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class RecuperarComponent {
  nombre: string = '';
  email: string = '';
  mensaje: string = '';
  isLoading: boolean = false;
  errores: any = {
    nombre: false,
    email: false
  };

  constructor(private recuperarService: RecuperarService) {}

  recuperarContrasena() {
    // Resetear estados
    this.mensaje = '';
    this.errores = { nombre: false, email: false };


    // Validación
    let hasError = false;
    
    if (!this.nombre.trim()) {
      this.errores.nombre = true;
      hasError = true;
    }
    
    if (!this.email.trim()) {
      this.errores.email = true;
      hasError = true;
    } else if (!this.validarEmail(this.email)) {
      this.errores.email = true;
      hasError = true;
    }

    if (hasError) {
      this.mensaje = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.isLoading = true;

    this.recuperarService.recuperarContrasena(this.nombre, this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Respuesta del servidor:', res);
        if (res.mensaje) {
          this.mensaje = res.mensaje;
          // Solo para desarrollo
          console.log('Datos de respuesta:', res.datos);
        } else {
          this.mensaje = res.error || 'Ocurrió un error al procesar tu solicitud.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error completo:', err);
        
        if (err.status === 400 && err.error?.camposFaltantes) {
          this.errores.nombre = err.error.camposFaltantes.nombre;
          this.errores.email = err.error.camposFaltantes.email;
          this.mensaje = err.error.error;
        } else if (err.status === 404) {
          this.mensaje = 'No encontramos una cuenta con esas credenciales.';
        } else {
          this.mensaje = 'Error al contactar al servidor. Por favor, intenta nuevamente.';
        }
      }
    });
  }

  private validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}