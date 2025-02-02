import { Route } from '@angular/router';
import { authRoutes } from './auth/auth.routes';

export const pageRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
    children: authRoutes,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
