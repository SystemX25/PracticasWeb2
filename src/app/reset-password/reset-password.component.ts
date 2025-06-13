import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  userId: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.userId = params['id'] || '';
      
      if (!this.token || !this.userId) {
        this.errorMessage = 'Enlace inválido o faltan parámetros';
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword(this.userId, this.token, newPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Contraseña actualizada correctamente';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirige al login después de 2 segundos
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar la contraseña';
      }
    });
  }
}