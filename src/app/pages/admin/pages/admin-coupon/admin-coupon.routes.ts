import { Routes } from '@angular/router';
import { AdminCouponComponent } from './admin-coupon.component';

export const adminCouponRoutes: Routes = [
  {
    path: '',
    component: AdminCouponComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-coupon-list/admin-coupon-list.component').then(
            (m) => m.AdminCouponListComponent,
          ),
        title: 'Danh sách mã giảm giá',
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './pages/admin-coupon-create/admin-coupon-create.component'
          ).then((m) => m.AdminCouponCreateComponent),
        title: 'Tạo mới mã giảm giá',
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/admin-coupon-edit/admin-coupon-edit.component').then(
            (m) => m.AdminCouponEditComponent,
          ),
        title: 'Cập nhật mã giảm giá',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
];
