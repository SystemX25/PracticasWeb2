import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecuperarService } from '../../services/recuperar.service'; // ajusta ruta si es necesario

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RecuperarComponent {
  nombre: string = '';
  mensaje: string = '';

  constructor(private recuperarService: RecuperarService) {}

  recuperarContrasena() {
    if (!this.nombre) {
      this.mensaje = 'Por favor, ingresa tu nombre de usuario.';
      return;
    }

    this.recuperarService.recuperar(this.nombre).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'Ocurrió un error';
      }
    });
  }
}
