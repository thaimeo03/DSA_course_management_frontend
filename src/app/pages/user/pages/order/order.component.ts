import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { PaymentService } from '@app/services/payment.service';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import { BaseTableComponent } from '@app/pages/components/base-table/base-table.component';
import { injectQuery } from '@bidv-api/angular';
import { getDateTime } from '@app/utils/transform-data';
import { CourseCellComponent } from './components/course-cell/course-cell.component';

@Component({
  selector: 'app-order',
  imports: [CommonModule, BaseTableComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent {
  #cdr = inject(ChangeDetectorRef);
  #paymentService = inject(PaymentService);
  #query = injectQuery();

  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: {
      mode: 'singleRow',
      checkboxes: false,
    },
  };

  protected renderedRowData: any[] = [];

  // Query
  #getSuccessOrderHistory = this.#query({
    queryKey: ['getSuccessOrderHistory'],
    queryFn: () => this.#paymentService.getSuccessOrderHistory(),
  });

  constructor() {
    this.createColumnDefs();
    this.initData();
  }

  // Init table configuration
  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'ID',
        field: 'id',
        width: 310,
        pinned: true,
      },
      {
        headerName: 'Khóa học',
        field: 'course',
        cellRenderer: CourseCellComponent,
        width: 400,
        tooltipField: 'title',
      },
      {
        headerName: 'Giá tiền',
        field: 'totalPrice',
        sortable: true,
        cellStyle: {
          color: '#FF4D00',
          fontWeight: '500',
        },
        width: 150,
      },
      {
        headerName: 'Thời gian tạo đơn',
        field: 'createdAt',
        width: 200,
      },
      {
        headerName: 'Thời gian thanh toán',
        field: 'paymentDate',
        sortable: true,
        width: 200,
      },
    ];
  }

  // Init data
  private initData() {
    this.#getSuccessOrderHistory.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      const orderData = data.data;
      this.renderedRowData = orderData.map((item) => {
        return {
          id: item.id,
          course: item.course,
          totalPrice: `${item.totalPrice} ₫`,
          createdAt: getDateTime(item.createdAt),
          paymentDate: getDateTime(item.paymentDate),
        };
      });

      this.#cdr.markForCheck();
    });
  }
}
