import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-coupon-form',
  imports: [CommonModule],
  templateUrl: './admin-coupon-form.component.html',
  styleUrl: './admin-coupon-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponFormComponent {}
