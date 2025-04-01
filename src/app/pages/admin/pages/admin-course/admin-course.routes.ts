import { Route } from '@angular/router';
import { AdminCourseComponent } from './admin-course.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';

export const adminCourseRoutes: Route[] = [
  {
    path: '',
    component: AdminCourseComponent,
    children: [
      {
        path: 'create',
        component: CreateCourseComponent,
        title: 'Tạo mới khóa học',
      },
    ],
  },
];
