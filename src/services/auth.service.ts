import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { LoginDto } from '../app/shared/dto/loginDto';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../app/shared/models/AuthResponse';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly API_URL = `${environment.apiUrl}api/usuarios`;

    login(credentials: LoginDto) {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials);
    }

    saveToken(token: string) {
        localStorage.setItem('auth_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const decoded: any = jwtDecode(token);
            const timeout = decoded.exp * 1000;
            return Date.now() >= timeout;
        } catch {
            return true;
        }
    }
}