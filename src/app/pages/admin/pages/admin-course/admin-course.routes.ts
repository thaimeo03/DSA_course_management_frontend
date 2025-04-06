import { Route } from '@angular/router';
import { AdminCourseComponent } from './admin-course.component';

export const adminCourseRoutes: Route[] = [
  {
    path: '',
    component: AdminCourseComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-course-list/admin-course-list.component').then(
            (m) => m.AdminCourseListComponent,
          ),
        title: 'Danh sách khóa học',
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './pages/admin-course-create/admin-course-create.component'
          ).then((m) => m.AdminCourseCreateComponent),
        title: 'Tạo mới khóa học',
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './pages/admin-course-detail/admin-course-detail.component'
          ).then((m) => m.AdminCourseDetailComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/admin-course-edit/admin-course-edit.component').then(
            (m) => m.AdminCourseEditComponent,
          ),
      },
      {
        path: '*',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
];
