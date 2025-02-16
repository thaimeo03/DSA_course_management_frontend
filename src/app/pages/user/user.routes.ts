import { Routes } from '@angular/router';
import { UserComponent } from './user.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'account',
        loadComponent: () =>
          import('./account/account.component').then((m) => m.AccountComponent),
        title: 'Account',
      },
      {
        path: 'order',
        loadComponent: () =>
          import('./order/order.component').then((m) => m.OrderComponent),
        title: 'Order',
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
    ],
  },
];
