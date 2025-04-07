import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeItem } from '@app/models';
import { BidvBadgeModule } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-lecture-status-cell',
  imports: [CommonModule, BidvBadgeModule],
  templateUrl: './admin-lecture-status-cell.component.html',
  styleUrl: './admin-lecture-status-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureStatusCellComponent
  implements ICellRendererAngularComp
{
  private inActiveStatusItem: BadgeItem = {
    label: 'Chưa kích hoạt',
    value: false,
    icon: 'bidvIconDismissCircle',
    class: 'badge-red',
  };

  private activeStatusItem: BadgeItem = {
    label: 'Đã kích hoạt',
    value: true,
    icon: 'bidvIconCheckmarkCircle',
    class: 'badge-green',
  };

  protected curStatusItem: BadgeItem | null = null;

  agInit(params: ICellRendererParams<any, any, any>): void {
    if (params.value) {
      this.curStatusItem = this.activeStatusItem;
    } else {
      this.curStatusItem = this.inActiveStatusItem;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
