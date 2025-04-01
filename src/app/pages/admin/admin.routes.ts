import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'course',
        loadComponent: () =>
          import('./pages/admin-course/admin-course.component').then(
            (m) => m.AdminCourseComponent,
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
