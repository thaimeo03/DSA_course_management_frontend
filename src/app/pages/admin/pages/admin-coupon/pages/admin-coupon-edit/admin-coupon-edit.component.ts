import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CouponData } from '@app/models/coupon';
import { LinkItem } from '@app/models';
import { CouponService } from '@app/services/coupon.service';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminCouponFormComponent } from '../components/admin-coupon-form/admin-coupon-form.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-coupon-edit',
  standalone: true,
  imports: [CommonModule, AdminCouponFormComponent],
  templateUrl: './admin-coupon-edit.component.html',
  styleUrl: './admin-coupon-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponEditComponent {
  #activatedRoute = inject(ActivatedRoute);
  #titleService = inject(Title);
  #couponService = inject(CouponService);
  #query = injectQuery();
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);

  // Data
  protected couponId = this.#activatedRoute.snapshot.params['id'];
  protected couponData: CouponData | null = null;

  // Breadcrumbs
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách mã giảm giá',
      link: ROUTES.adminCoupon,
    },
    {
      label: 'Chỉnh sửa mã giảm giá',
    },
  ];

  // Query Options
  protected getCouponDetailOptions = (id?: string) =>
    queryOptions({
      enabled: !!id,
      queryKey: ['admin-coupon-detail', id],
      queryFn: () => {
        if (!id) return;
        return this.#couponService.getCouponDetail(id);
      },
      refetchOnWindowFocus: false,
    });

  // Queries
  #getCouponDetailQuery = this.#query(this.getCouponDetailOptions());

  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.#getCouponDetailQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.couponData = data.data;
        this.#titleService.setTitle(`Mã giảm giá: ${this.couponData.code}`);
        this.#cdr.markForCheck();
      });

    this.#getCouponDetailQuery.updateOptions(
      this.getCouponDetailOptions(this.couponId),
    );
  }
}
