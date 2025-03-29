import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubmissionStatus } from '@app/enums/submission';
import { BadgeItem } from '@app/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-cell',
  imports: [CommonModule],
  templateUrl: './status-cell.component.html',
  styleUrl: './status-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusCellComponent implements ICellRendererAngularComp {
  protected curStatusItem: BadgeItem | null = null;

  private passedStatusItems: BadgeItem = {
    label: 'Đã vượt qua',
    value: SubmissionStatus.Passed,
    class: 'text-green',
  };

  private failedStatusItems: BadgeItem = {
    label: 'Lỗi',
    value: SubmissionStatus.Failed,
    class: 'text-red',
  };

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value as SubmissionStatus) {
      case SubmissionStatus.Passed:
        this.curStatusItem = this.passedStatusItems;
        break;
      case SubmissionStatus.Failed:
        this.curStatusItem = this.failedStatusItems;
        break;
      default:
        this.curStatusItem = null;
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
