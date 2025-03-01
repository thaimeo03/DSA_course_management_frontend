import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeItem } from '@app/models';
import { BidvBadgeModule } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status',
  imports: [CommonModule, BidvBadgeModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent implements ICellRendererAngularComp {
  private statusItems: BadgeItem[] = [
    {
      label: 'Todo',
      value: 0,
      icon: 'bidvIconCircleOutline',
      class: 'badge-gray',
    },
    {
      label: 'Pending',
      value: 1,
      icon: 'bidvIconClock',
      class: 'badge-orange',
    },
    {
      label: 'Failed',
      value: 2,
      icon: 'bidvIconDismissCircle',
      class: 'badge-red',
    },
    {
      label: 'Done',
      value: 3,
      icon: 'bidvIconCheckmarkCircle',
      class: 'badge-green',
    },
  ];

  protected curStatusItem: BadgeItem = this.statusItems[0];

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value) {
      case 0:
        this.curStatusItem = this.statusItems[0];
        break;
      case 1:
        this.curStatusItem = this.statusItems[1];
        break;
      case 2:
        this.curStatusItem = this.statusItems[2];
        break;
      case 3:
        this.curStatusItem = this.statusItems[3];
        break;
      default:
        this.curStatusItem = this.statusItems[0];
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
