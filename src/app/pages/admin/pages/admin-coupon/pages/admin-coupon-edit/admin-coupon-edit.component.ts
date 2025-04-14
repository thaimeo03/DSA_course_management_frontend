import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-coupon-edit',
  imports: [CommonModule],
  templateUrl: './admin-coupon-edit.component.html',
  styleUrl: './admin-coupon-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponEditComponent {}
