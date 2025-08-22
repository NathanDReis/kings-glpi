import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './pages/public/public-layout/public-layout';
import { LoginComponent } from './pages/public/login/login';
import { PrivateLayoutComponent } from './pages/private/private-layout/private-layout';
import { PanelComponent } from './pages/private/panel/panel';
import { AuthGuard, AuthGuardPublic } from './core/auth/auth.guard';
import { RecoverComponent } from './pages/public/recover/recover';

export const routes: Routes = [
  {
    path: 'credentials',
    component: PublicLayoutComponent,
    canActivateChild: [AuthGuardPublic],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'recover', component: RecoverComponent },
      { path: '**', redirectTo: 'login' },
    ]
  },
  {
    path: 'support',
    component: PrivateLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'panel', component: PanelComponent },
      { path: '**', redirectTo: 'panel' },
    ]
  },
  { path: '**', redirectTo: 'credentials' },
];
