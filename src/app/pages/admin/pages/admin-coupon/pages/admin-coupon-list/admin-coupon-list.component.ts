import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { injectQuery } from '@bidv-api/angular';
import { BidvButtonModule } from '@bidv-ui/core';

@Component({
  selector: 'app-admin-coupon-list',
  imports: [CommonModule, BreadcrumbsComponent, BidvButtonModule],
  templateUrl: './admin-coupon-list.component.html',
  styleUrl: './admin-coupon-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponListComponent {
  #router = inject(Router);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #query = injectQuery();

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách mã giảm giá',
    },
  ];

  // Handlers
  protected navigateToCreateCoupon() {
    this.#router.navigate([ROUTES.adminCreateCoupon]);
  }
}
