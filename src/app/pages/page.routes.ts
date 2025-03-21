import { Route } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';

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
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.routes').then((m) => m.userRoutes),
      },
      {
        path: 'course/:id',
        loadComponent: () =>
          import('./course/course.component').then((m) => m.CourseComponent),
      },
      {
        path: 'course/:id/lecture',
        loadComponent: () =>
          import('./course/pages/lecture/lecture.component').then(
            (m) => m.LectureComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'course/:id/problem-repository',
        loadComponent: () =>
          import(
            './course/pages/problem-repository/problem-repository.component'
          ).then((m) => m.ProblemRepositoryComponent),
        title: 'Problems',
        canActivate: [authGuard],
      },
      {
        path: 'problem/:problemId',
        loadComponent: () =>
          import('./problem/problem.component').then((m) => m.ProblemComponent),
        canActivate: [authGuard],
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
