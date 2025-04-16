import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CouponService } from '@app/services/coupon.service';
import { DialogService } from '@app/services/share/dialog.service';
import { injectMutation, injectQueryClient } from '@bidv-api/angular';
import { BidvAlertService, BidvButtonModule } from '@bidv-ui/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-coupon-list-action',
  imports: [CommonModule, BidvButtonModule],
  templateUrl: './admin-coupon-list-action.component.html',
  styleUrl: './admin-coupon-list-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponListActionComponent
  implements ICellRendererAngularComp
{
  #couponService = inject(CouponService);
  #dialogs = inject(DialogService);
  #router = inject(Router);
  #queryClient = injectQueryClient();
  #mutation = injectMutation();
  #alerts = inject(BidvAlertService);

  // Data
  protected couponId: string | null = null;

  // Mutations
  #deleteLectureMutation = this.#mutation({
    mutationFn: (id: string) => this.#couponService.deleteCoupon(id),
    onSuccess: () => {
      this.#queryClient.invalidateQueries({
        queryKey: ['admin-all-coupons'],
      });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa mã giảm giá thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Xóa mã giảm giá thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.couponId = params.data?.id;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  // Handlers
  protected handleEditCoupon() {
    if (!this.couponId) return;
    this.#router.navigate([
      ROUTES.adminCouponEdit.replace(':id', this.couponId),
    ]);
  }

  protected handleDeleteCoupon() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa mã giảm giá này?')
      .subscribe((status: any) => {
        if (!status) return;

        if (this.couponId) {
          this.#deleteLectureMutation.mutate(this.couponId);
        }
      });
  }
}
