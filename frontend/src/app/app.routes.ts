import { Routes } from '@angular/router';
import { PublicLayout } from './pages/public/public-layout/public-layout.component';
import { Login } from './pages/public/login/login.component';
import { PrivateLayout } from './pages/private/private-layout/private-layout.component';
import { Panel } from './pages/private/panel/panel.component';
import { AuthGuard, AuthGuardPublic } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    canActivateChild: [AuthGuardPublic],
    children: [
      { path: 'login', component: Login },
    ]
  },
  {
    path: '',
    component: PrivateLayout,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'panel', component: Panel },
    ]
  },
  { path: '**', redirectTo: 'login' },
];
