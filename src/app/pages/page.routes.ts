import { Route } from '@angular/router';

export const pageRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
        title: 'Home',
      },
      {
        path: 'purchased-course',
        loadComponent: () =>
          import('./purchased-course/purchased-course.component').then(
            (m) => m.PurchasedCourseComponent,
          ),
        title: 'Purchased course',
      },
    ],
    title: 'Home',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
