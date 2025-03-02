import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import { BaseTableComponent } from '../base-table/base-table.component';
import { StatusComponent } from './status/status.component';
import { DifficultyComponent } from './difficulty/difficulty.component';
import { SelectItem } from '@app/models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BidvDataListWrapperModule, BidvSelectModule } from '@bidv-ui/kit';
import {
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';

@Component({
  selector: 'app-problem-table',
  imports: [
    CommonModule,
    BaseTableComponent,
    ReactiveFormsModule,
    BidvSelectModule,
    BidvDataListModule,
    BidvDataListWrapperModule,
    BidvTextfieldControllerModule,
  ],
  templateUrl: './problem-table.component.html',
  styleUrl: './problem-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemTableComponent implements OnInit {
  @Input() hidePagination = false;
  @Input() hideStatus = false;
  @Input() rowLink = false;
  @Input() hideFilter = false;

  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: 'single',
    unSortIcon: true,
    rowStyle: this.rowLink ? { cursor: 'pointer' } : undefined,
  };
  protected rowData: any[] = [];

  // Filter
  protected filterByDifficulties: SelectItem[] = [
    {
      label: 'Dễ',
      value: 'easy',
    },
    {
      label: 'Trung bình',
      value: 'medium',
    },
    {
      label: 'Khó',
      value: 'hard',
    },
  ];

  protected filterByStatuses: SelectItem[] = [
    {
      label: 'Chưa làm',
      value: 'todo',
    },
    {
      label: 'Đang làm',
      value: 'pending',
    },
    {
      label: 'Đã xong',
      value: 'done',
    },
    {
      label: 'Lỗi',
      value: 'failed',
    },
  ];

  protected filterForm = new FormGroup({
    difficulty: new FormControl(null),
    status: new FormControl(null),
  });

  constructor() {
    this.createColumnDefs();
    this.createRowData();
  }

  ngOnInit(): void {
    // Set grid options
    this.gridOptions.rowStyle = this.rowLink
      ? { cursor: 'pointer' }
      : undefined;
    this.gridOptions.enableCellTextSelection = !this.rowLink;

    // Set show/hide status
    const statusColumn = this.columnDefs.find(
      (column) => (column as ColDef).field === 'status',
    );

    if (statusColumn) {
      (statusColumn as ColDef).hide = this.hideStatus;
    }
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: '#',
        field: 'id',
        width: 80,
        pinned: true,
      },
      {
        headerName: 'Title',
        field: 'title',
        flex: 1,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: StatusComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Point',
        field: 'point',
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Difficulty',
        field: 'difficulty',
        cellRenderer: DifficultyComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Updated At',
        field: 'updatedAt',
        sortable: true,
        width: 150,
      },
    ];
  }

  private createRowData() {
    const rowData = [];

    for (let i = 0; i < 13; i++) {
      const index = i + 1;

      rowData.push({
        id: index,
        status: Math.floor(Math.random() * 4),
        title: `Title ${index}`,
        point: `Point ${index}`,
        difficulty: Math.floor(Math.random() * 3),
        updatedAt: `Updated At ${index}`,
      });
    }

    this.rowData = rowData;
  }
}
