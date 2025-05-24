import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Añadido
import { RecuperarService } from '../../services/recuperar.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule] // Añadido RouterModule
})
export class RecuperarComponent {
  nombre: string = '';
  correo_electronico: string = '';
  mensaje: string = '';
  isLoading: boolean = false;

  constructor(private recuperarService: RecuperarService) {}

  recuperarContrasena() {
    // Validación más robusta
    if (!this.nombre.trim() || !this.correo_electronico.trim()) {
      this.mensaje = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    // Validación básica de email
    if (!this.correo_electronico.includes('@')) {
      this.mensaje = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;
    this.mensaje = '';

    this.recuperarService.recuperar(this.nombre, this.correo_electronico).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Se ha enviado la información de recuperación.';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en recuperación:', err);
        this.mensaje = err.error?.error || 'Error al procesar tu solicitud. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}