import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../shared/dto/loginDto';
import { AuthResponse } from '../shared/models/AuthResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private router: Router) { }

  login() {
    if (this.form.invalid) return;

    this.authService.login(this.form.value as LoginDto).subscribe({
      next: (res: AuthResponse) => {
        console.log(res);
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login fallido', err);
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}
