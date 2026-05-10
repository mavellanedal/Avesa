import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import { authGuard } from '@core/guards/auth.guard';
import {rolesGuard} from '@core/guards/roles.guard';
import {ROLES} from '@shared/constants/roles.constant';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@features/dashboard/dashboard.component'),
      },
      {
        path: 'user-tracking',
        loadComponent: () => import('./features/users-tracking/user-tracking.component'),
        canActivate: [rolesGuard],
        data: { role: ROLES.CONFIGURATION_READ }
      },
      {
        path: 'lead-tracking',
        loadComponent: () => import('./features/lead-tracking/lead-tracking.component'),
        canActivate: [rolesGuard],
        data: { role: ROLES.LEADS_READ }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
