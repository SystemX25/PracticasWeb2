import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, HttpClientModule], // 👈 aquí van los módulos necesarios
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient,
        private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const { nombre, password } = this.loginForm.value;

    this.http.get<any>(`http://localhost:3000/api/user`, {
      params: {
        nombre: nombre,        // ← lo estás llamando "nombre" en tu backend
        password: password
      }
    }).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        //alert('Login exitoso');
        this.router.navigate(['/productos']);
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
