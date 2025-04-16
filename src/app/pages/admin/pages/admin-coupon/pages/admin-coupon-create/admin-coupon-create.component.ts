import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminCouponFormComponent } from '../components/admin-coupon-form/admin-coupon-form.component';

@Component({
  selector: 'app-admin-coupon-create',
  standalone: true,
  imports: [CommonModule, AdminCouponFormComponent],
  templateUrl: './admin-coupon-create.component.html',
  styleUrl: './admin-coupon-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponCreateComponent {}
