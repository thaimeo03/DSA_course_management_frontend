import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService } from '@app/services/share/dialog.service';
import { BidvButtonModule } from '@bidv-ui/core';
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
  #dialogs = inject(DialogService);

  // Data
  protected couponId: string | null = null;

  // Lifecycle
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.couponId = params.data?.id;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  // Handlers
  protected handleDeleteCoupon() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        // this.#deleteCouponMutation.mutate(null);
      });
  }
}
