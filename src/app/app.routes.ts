import { Routes } from '@angular/router';
import { pageRoutes } from './pages/page.routes';

export const routes: Routes = [
  {
    path: '',
    children: pageRoutes,
  },
];
