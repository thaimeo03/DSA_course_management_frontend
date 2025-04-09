import { Route } from '@angular/router';
import { AdminProblemComponent } from './admin-problem.component';

export const adminProblemRoutes: Route[] = [
  {
    path: '',
    component: AdminProblemComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/admin-problem-list/admin-problem-list.component'
          ).then((m) => m.AdminProblemListComponent),
        title: 'Danh sách bài tập',
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './pages/admin-problem-create/admin-problem-create.component'
          ).then((m) => m.AdminProblemCreateComponent),
        title: 'Tạo mới bài tập',
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './pages/admin-problem-detail/admin-problem-detail.component'
          ).then((m) => m.AdminProblemDetailComponent),
        title: 'Chi tiết bài tập',
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import(
            './pages/admin-problem-edit/admin-problem-edit.component'
          ).then((m) => m.AdminProblemEditComponent),
        title: 'Cập nhật bài tập',
      },
      {
        path: '*',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
];
