import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.getToken() && !authService.isTokenExpired()) {
        return true;
    }

    console.warn('Acceso denegado: Token inválido o expirado');
    router.navigate(['/login']);
    return false;
};