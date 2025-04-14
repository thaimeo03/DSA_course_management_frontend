import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-coupon-create',
  imports: [CommonModule],
  templateUrl: './admin-coupon-create.component.html',
  styleUrl: './admin-coupon-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponCreateComponent {}
