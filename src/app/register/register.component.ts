import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule], 
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  showPassword = {
    password: false,
    confirmPassword: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { name, email, password } = this.registerForm.value;
      
      this.authService.register(name, email, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/'], {
            state: { registrationSuccess: true }
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.error || 'Error en el registro';
          console.error('Error en registro:', err);
        }
      });
    }
  }
}