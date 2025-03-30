import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ColDef,
  ColGroupDef,
  GridOptions,
  RowClickedEvent,
} from 'ag-grid-community';
import { BaseTableComponent } from '@app/pages/components/base-table/base-table.component';
import { injectQuery, QueryObserverResult } from '@bidv-api/angular';
import { getDateTime } from '@app/utils/transform-data';
import { SubmissionService } from '@app/services/submission.service';
import { Result } from 'node_modules/@bidv-api/angular/build/lib/types';
import {
  GetSubmissionHistoryResponse,
  SubmissionHistoryData,
} from '@app/models/submission';
import { StatusCellComponent } from './components/status-cell/status-cell.component';
import { LanguageCellComponent } from './components/language-cell/language-cell.component';

@Component({
  selector: 'app-submission-history',
  imports: [CommonModule, BaseTableComponent],
  templateUrl: './submission-history.component.html',
  styleUrl: './submission-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionHistoryComponent implements OnInit {
  #cdr = inject(ChangeDetectorRef);
  #submissionService = inject(SubmissionService);
  #query = injectQuery();

  @Input({ required: true }) problemId!: string;
  @Output() selectedRowDataEvent = new EventEmitter<SubmissionHistoryData>();

  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: {
      mode: 'singleRow',
      checkboxes: false,
    },
    rowStyle: { cursor: 'pointer' },
    onRowClicked: this.onRowClicked.bind(this),
  };

  protected renderedRowData: any[] = [];

  // Query
  #getSubmissionHistoryQuery!: Result<
    QueryObserverResult<GetSubmissionHistoryResponse, Error>
  >;

  constructor() {
    this.createColumnDefs();
  }

  ngOnInit(): void {
    this.initData();
  }

  // Init table configuration
  private createColumnDefs() {
    this.columnDefs = [
      {
        field: 'submissionData',
        hide: true,
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        cellRenderer: StatusCellComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Ngôn ngữ',
        field: 'language',
        cellRenderer: LanguageCellComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Thời gian nộp bài',
        field: 'createdAt',
        flex: 1,
      },
    ];
  }

  // Init data
  private initData() {
    this.#getSubmissionHistoryQuery = this.#query({
      queryKey: ['submission-history', this.problemId],
      queryFn: () =>
        this.#submissionService.getSubmissionHistory(this.problemId),
    });

    this.#getSubmissionHistoryQuery.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      const submissionHistoryData = data.data;
      this.renderedRowData = submissionHistoryData.map((item) => {
        return {
          submissionData: item,
          status: item.status,
          language: item.sourceCode.language,
          createdAt: getDateTime(item.createdAt),
        };
      });

      this.#cdr.markForCheck();
    });
  }

  // Handlers
  private onRowClicked(event: RowClickedEvent) {
    const submissionData = event.data.submissionData;

    this.selectedRowDataEvent.emit(submissionData);
  }
}
