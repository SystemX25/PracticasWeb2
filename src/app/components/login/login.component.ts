import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.http.get<any>(`http://localhost:3000/api/user`, {
      params: {
        nombre: email,        // ← lo estás llamando "nombre" en tu backend
        password: password
      }
    }).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        // Puedes guardar el usuario o token aquí
      },
      error: (err) => {
        console.error('Error de login:', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}

}
