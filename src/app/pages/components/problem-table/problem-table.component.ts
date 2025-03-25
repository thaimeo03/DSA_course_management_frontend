import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  ColDef,
  ColGroupDef,
  GridOptions,
  RowClickedEvent,
} from 'ag-grid-community';
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
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';

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
  private router = inject(Router);

  @Input({ required: true }) courseId!: string | null;
  @Input() hidePagination = false;
  @Input() hideStatus = false;
  @Input() clickableRow = false;
  @Input() hideFilter = false;

  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: {
      mode: 'singleRow',
      checkboxes: false,
    },
    rowStyle: this.clickableRow ? { cursor: 'pointer' } : undefined,
    onRowClicked: this.onRowClicked.bind(this),
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
    this.gridOptions.rowStyle = this.clickableRow
      ? { cursor: 'pointer' }
      : undefined;
    this.gridOptions.enableCellTextSelection = !this.clickableRow;

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
        field: 'id',
        hide: true,
      },
      {
        headerName: '#',
        field: 'num',
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
        id: `id-${index}`,
        num: index,
        status: Math.floor(Math.random() * 4),
        title: `Title ${index}`,
        point: `Point ${index}`,
        difficulty: Math.floor(Math.random() * 3),
        updatedAt: `Updated At ${index}`,
      });
    }

    this.rowData = rowData;
  }

  private onRowClicked(event: RowClickedEvent) {
    if (!this.clickableRow) return;

    const problemId = event.data.id;
    this.router.navigate([
      ROUTES.detailCourse,
      this.courseId,
      ROUTES.problem,
      problemId,
    ]);
  }
}
