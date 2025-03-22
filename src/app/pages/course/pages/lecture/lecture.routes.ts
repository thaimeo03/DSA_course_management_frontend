import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';

export const lectureRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lecture.component').then((m) => m.LectureComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/lecture-content-page/lecture-content-page.component'
          ).then((m) => m.LectureContentPageComponent),
      },
    ],
    canActivate: [authGuard],
  },
];
