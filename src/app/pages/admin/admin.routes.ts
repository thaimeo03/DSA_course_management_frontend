import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'course',
        loadChildren: () =>
          import('./pages/admin-course/admin-course.routes').then(
            (m) => m.adminCourseRoutes,
          ),
        title: 'Quản lý khóa học',
      },
      {
        path: 'lecture',
        loadComponent: () =>
          import('./pages/admin-lecture/admin-lecture.component').then(
            (m) => m.AdminLectureComponent,
          ),
        title: 'Quản lý bài giảng',
      },
      {
        path: '**',
        redirectTo: 'course',
        pathMatch: 'full',
      },
    ],
  },
];
