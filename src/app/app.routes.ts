import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/page.routes').then((m) => m.pageRoutes),
  },
];
