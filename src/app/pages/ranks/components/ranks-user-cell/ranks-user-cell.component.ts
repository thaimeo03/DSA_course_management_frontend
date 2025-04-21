import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserRankData } from '@app/models/user';
import { BidvAvatarComponent } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ranks-user-cell',
  imports: [CommonModule, BidvAvatarComponent],
  templateUrl: './ranks-user-cell.component.html',
  styleUrl: './ranks-user-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RanksUserCellComponent implements ICellRendererAngularComp {
  protected user: UserRankData | null = null;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.user = params.value;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
