import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './pages/public/public-layout/public-layout';
import { LoginComponent } from './pages/public/login/login';
import { PrivateLayoutComponent } from './pages/private/private-layout/private-layout';
import { PanelComponent } from './pages/private/panel/panel';
import { AuthGuard, AuthGuardPublic } from './core/auth.guard';
import { RecoverComponent } from './pages/public/recover/recover';
import { ProductComponent } from './pages/private/product/product';
import { BudgetComponent } from './pages/private/budget/budget';
import { ConfigComponent } from './pages/private/config/config';
import { NewBudgetComponent } from './pages/private/budget/new-budget/new-budget';

export const routes: Routes = [
  {
    path: 'credenciais',
    component: PublicLayoutComponent,
    canActivateChild: [AuthGuardPublic],
    children: [
      { path: 'entrar', component: LoginComponent },
      { path: 'recuperar', component: RecoverComponent },
    ]
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'painel', component: PanelComponent },
      { path: 'produto', component: ProductComponent },
      { path: 'orcamento', component: BudgetComponent },
      { path: 'orcamento-criar', component: NewBudgetComponent },
      { path: 'orcamento-editar/:id', component: NewBudgetComponent },
      { path: 'configuracoes', component: ConfigComponent },
      { path: '**', redirectTo: '/painel' },
    ]
  },
];
