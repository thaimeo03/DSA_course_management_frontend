import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { authGuard } from '@app/guards/auth.guard';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account.component').then(
            (m) => m.AccountComponent,
          ),
        title: 'Account',
      },
      {
        path: 'order',
        loadComponent: () =>
          import('./pages/order/order.component').then((m) => m.OrderComponent),
        title: 'Order',
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
    ],
    canActivate: [authGuard],
  },
];
