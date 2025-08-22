import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map(user => {
            if (user) return true;

            router.navigate(['/credentials/login']);
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

            router.navigate(['/support/panel']);
            return false;
        })
    );
};
