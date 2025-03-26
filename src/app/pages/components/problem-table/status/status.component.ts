import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubmissionStatus } from '@app/enums/submission';
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
      value: SubmissionStatus.Todo,
      icon: 'bidvIconCircleOutline',
      class: 'badge-gray',
    },
    {
      label: 'Failed',
      value: SubmissionStatus.Failed,
      icon: 'bidvIconDismissCircle',
      class: 'badge-red',
    },
    {
      label: 'Done',
      value: SubmissionStatus.Passed,
      icon: 'bidvIconCheckmarkCircle',
      class: 'badge-green',
    },
  ];

  protected curStatusItem: BadgeItem = this.statusItems[0];

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value as SubmissionStatus) {
      case SubmissionStatus.Failed:
        this.curStatusItem = this.statusItems[0];
        break;
      case SubmissionStatus.Passed:
        this.curStatusItem = this.statusItems[1];
        break;
      case SubmissionStatus.Todo:
        this.curStatusItem = this.statusItems[2];
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
