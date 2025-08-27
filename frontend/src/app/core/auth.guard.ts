import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map(user => {
            if (user) return true;

            router.navigate(['/credenciais/entrar']);
            return false;
        })
    );
};

export const AuthGuardPublic: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map(user => {
            if (!user) return true;

            router.navigate(['/painel']);
            return false;
        })
    );
};
