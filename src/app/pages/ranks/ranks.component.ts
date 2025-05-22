import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { BaseTableComponent } from '../components/base-table/base-table.component';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import { GetRanksParams } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { RanksUserCellComponent } from './components/ranks-user-cell/ranks-user-cell.component';

@Component({
  selector: 'app-ranks',
  imports: [CommonModule, BreadcrumbsComponent, BaseTableComponent],
  templateUrl: './ranks.component.html',
  styleUrl: './ranks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RanksComponent {
  #userService = inject(UserService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Bảng xếp hạng',
    },
  ];

  // Data
  protected params: GetRanksParams = {
    page: 1,
    limit: 10,
  };

  // Queries
  protected getRanksQuery = (params: GetRanksParams) =>
    this.#userService.getRanks(params);

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
        headerName: 'STT',
        field: 'no',
        width: 80,
        pinned: true,
      },
      {
        headerName: 'Học viên',
        field: 'user',
        cellRenderer: RanksUserCellComponent,
        width: 350,
        tooltipField: 'fullName',
      },
      {
        headerName: 'Tổng điểm',
        field: 'score',
        flex: 1,
        cellStyle: {
          fontWeight: '500',
          color: '#FF4D00',
        },
      },
    ];
  }
}
