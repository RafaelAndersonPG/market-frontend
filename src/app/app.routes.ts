import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './shared/guard/auth.guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { Puesto } from './puesto/puesto';
import { Debts } from './debts/debts';
import { Charge } from './charge/charge';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard', component: Dashboard, canActivate: [authGuard]
      },
      { path: 'puesto', component: Puesto, canActivate: [authGuard] },
      { path: 'deudas', component: Debts, canActivate: [authGuard] },
      { path: 'cargos', component: Charge, canActivate: [authGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];