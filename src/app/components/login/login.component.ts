import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule], // 👈 aquí van los módulos necesarios
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

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
    console.log(nombre + password);
    this.http.get<any>(`http://localhost:3000/api/user`, {
      params: {
        nombre: nombre,        
        password: password
      }
    }).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        //alert('Login exitoso');
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error('Error de login:', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}

}
