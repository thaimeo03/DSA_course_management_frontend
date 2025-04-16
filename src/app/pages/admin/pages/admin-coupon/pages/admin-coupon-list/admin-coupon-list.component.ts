import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CouponType } from '@app/enums/coupon';
import { LinkItem } from '@app/models';
import { GetAllCouponsParams } from '@app/models/coupon';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CouponService } from '@app/services/coupon.service';
import { getDateTime } from '@app/utils/transform-data';
import { injectQuery } from '@bidv-api/angular';
import { BidvDay } from '@bidv-ui/cdk';
import { BidvButtonModule } from '@bidv-ui/core';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import { BaseTableComponent } from '../../../../../components/base-table/base-table.component';
import { AdminCouponListActionComponent } from './components/admin-coupon-list-action/admin-coupon-list-action.component';

@Component({
  selector: 'app-admin-coupon-list',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BaseTableComponent,
  ],
  templateUrl: './admin-coupon-list.component.html',
  styleUrl: './admin-coupon-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCouponListComponent {
  #couponService = inject(CouponService);
  #router = inject(Router);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách mã giảm giá',
    },
  ];

  // Data
  protected params: GetAllCouponsParams = {
    page: 1,
    limit: 10,
  };

  // Queries
  protected getAllCouponsQuery = (params: GetAllCouponsParams) =>
    this.#couponService.getAllCoupons(params);

  // Table config
  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: {
      mode: 'singleRow',
      checkboxes: false,
    },
    suppressClickEdit: true,
  };

  // Lifecycle
  constructor() {
    this.createColumnDefs();
  }

  // Init table
  private createColumnDefs() {
    this.columnDefs = [
      {
        field: 'id',
        hide: true,
      },
      {
        headerName: 'STT',
        field: 'no',
        width: 80,
        pinned: true,
      },
      {
        headerName: 'Loại giảm giá',
        field: 'type',
        valueGetter: (params) => {
          const type = params.data.type as CouponType;

          if (type === CouponType.PercentOff) {
            return 'Phần trăm';
          }

          if (type === CouponType.AmountOff) {
            return 'Số tiền';
          }

          return '';
        },
        width: 150,
        pinned: true,
      },
      {
        headerName: 'Mã giảm giá',
        field: 'code',
        width: 250,
        pinned: true,
        cellStyle: {
          fontWeight: '500',
        },
      },
      {
        headerName: 'Giá trị',
        field: 'value', // Just temporary name
        valueGetter: (params) => {
          const type = params.data.type as CouponType;

          if (type === CouponType.PercentOff) {
            return `${params.data.percentOff}%`;
          }

          if (type === CouponType.AmountOff) {
            return `${params.data.amountOff.toLocaleString('vi-VN')} đ`;
          }

          return '';
        },
        width: 100,
        cellStyle: {
          color: '#FF4D00',
          fontWeight: '500',
        },
      },
      {
        headerName: 'Số lượng',
        field: 'maxRedeem',
        valueGetter: (params) => {
          const maxRedeem = params.data.maxRedeem;

          if (maxRedeem === null) return 'Không giới hạn';

          return maxRedeem;
        },
        width: 150,
      },
      {
        headerName: 'Hết hạn lúc',
        field: 'expiredAt',
        valueGetter: (params) => {
          const updatedAt = params.data.expiredAt;
          if (!updatedAt) return 'Không có';

          return getDateTime(updatedAt);
        },
        sortable: true,
      },
      {
        headerName: 'Cập nhật lúc',
        field: 'updatedAt',
        valueGetter: (params) => {
          const updatedAt = params.data.updatedAt;

          return BidvDay.fromUtcNativeDate(new Date(updatedAt)).getFormattedDay(
            'DMY',
            '/',
          );
        },
        sortable: true,
      },
      {
        headerName: 'Thao tác',
        cellRenderer: AdminCouponListActionComponent,
        flex: 1,
      },
    ];
  }

  // Handlers
  protected navigateToCreateCoupon() {
    this.#router.navigate([ROUTES.adminCreateCoupon]);
  }
}
