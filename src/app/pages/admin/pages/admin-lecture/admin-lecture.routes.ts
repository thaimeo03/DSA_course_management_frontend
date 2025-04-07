import { Route } from '@angular/router';
import { AdminLectureComponent } from './admin-lecture.component';

export const adminLectureRoutes: Route[] = [
  {
    path: '',
    component: AdminLectureComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/admin-lecture-list/admin-lecture-list.component'
          ).then((m) => m.AdminLectureListComponent),
        title: 'Danh sách bài giảng',
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './pages/admin-lecture-create/admin-lecture-create.component'
          ).then((m) => m.AdminLectureCreateComponent),
        title: 'Tạo mới bài giảng',
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './pages/admin-lecture-detail/admin-lecture-detail.component'
          ).then((m) => m.AdminLectureDetailComponent),
        title: 'Chi tiết bài giảng',
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import(
            './pages/admin-lecture-edit/admin-lecture-edit.component'
          ).then((m) => m.AdminLectureEditComponent),
        title: 'Cập nhật bài giảng',
      },
      {
        path: '*',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
];
