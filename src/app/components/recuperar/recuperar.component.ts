import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecuperarService } from '../../services/recuperar.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  email: string = '';
  mensaje: string = '';
  isLoading: boolean = false;
  errorEmail: boolean = false;

  constructor(private recuperarService: RecuperarService) {}

  solicitarRecuperacion() {
    // Resetear estados
    this.mensaje = '';
    this.errorEmail = false;

    // Validación
    if (!this.email.trim()) {
      this.errorEmail = true;
      this.mensaje = 'Por favor, ingresa tu correo electrónico.';
      return;
    } else if (!this.validarEmail(this.email)) {
      this.errorEmail = true;
      this.mensaje = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;

    this.recuperarService.solicitarRecuperacion(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.mensaje) {
          this.mensaje = '¡Listo! Hemos enviado un correo con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).';
          this.email = ''; 
        } else {
          this.mensaje = 'Ocurrió un error al procesar tu solicitud.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.mensaje = 'No encontramos una cuenta con ese correo electrónico.';
        } else if (err.status === 429) {
          this.mensaje = 'Has realizado demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.';
        } else {
          this.mensaje = 'Error al contactar al servidor. Por favor, intenta nuevamente más tarde.';
        }
      }
    });
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}