import { Routes } from '@angular/router';
import { PublicLayout } from './pages/public/public-layout/public-layout';
import { LoginComponent } from './pages/public/login/login';
import { RecoverComponent } from './pages/public/recover/recover';
import { PrivateLayout } from './pages/private/private-layout/private-layout';
import { PanelComponent } from './pages/private/panel/panel';
import { BudgetComponent } from './pages/private/budget/budget';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'recover', component: RecoverComponent },
      { path: '**', redirectTo: 'login' }
    ]
  },
  {
    path: 'suporte',
    component: PrivateLayout,
    children: [
      { path: 'panel', component: PanelComponent },
      { path: 'budget', component: BudgetComponent },
    ]
  },
];
