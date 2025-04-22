import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeItem } from '@app/models';
import { BidvBadgeModule } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-account-status-cell',
  imports: [CommonModule, BidvBadgeModule],
  templateUrl: './admin-account-status-cell.component.html',
  styleUrl: './admin-account-status-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAccountStatusCellComponent
  implements ICellRendererAngularComp
{
  protected curStatusItem: BadgeItem | null = null;

  // Context
  private unVerifiedStatusItem: BadgeItem = {
    label: 'Chưa xác thực',
    value: '',
    icon: 'bidvIconDismissCircle',
    class: 'badge-red',
  };

  private verifiedStatusItem: BadgeItem = {
    label: 'Đã xác thực',
    value: '',
    icon: 'bidvIconCheckmarkCircle',
    class: 'badge-green',
  };

  agInit(params: ICellRendererParams<any, any, any>): void {
    const isVerified = params.value;

    this.curStatusItem = isVerified
      ? this.verifiedStatusItem
      : this.unVerifiedStatusItem;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
