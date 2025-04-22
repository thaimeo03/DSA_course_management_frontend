import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountData } from '@app/models/user';
import { BidvAvatarComponent } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-account-student-cell',
  imports: [CommonModule, BidvAvatarComponent],
  templateUrl: './admin-account-student-cell.component.html',
  styleUrl: './admin-account-student-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAccountStudentCellComponent
  implements ICellRendererAngularComp
{
  protected accountData: AccountData | null = null;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.accountData = params.data;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
