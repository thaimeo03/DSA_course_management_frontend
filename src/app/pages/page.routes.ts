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
          import('./lecture/lecture.component').then((m) => m.LectureComponent),
      },
      {
        path: 'course/:id/problem-repository',
        loadComponent: () =>
          import('./problem-repository/problem-repository.component').then(
            (m) => m.ProblemRepositoryComponent,
          ),
        title: 'Problems',
      },
      {
        path: 'problem/:problemId',
        loadComponent: () =>
          import('./problem/problem.component').then((m) => m.ProblemComponent),
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
