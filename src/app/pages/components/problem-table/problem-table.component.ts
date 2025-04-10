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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BidvDataListWrapperModule,
  BidvInputModule,
  BidvSelectModule,
} from '@bidv-ui/kit';
import {
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { ProblemService } from '@app/services/problem.service';
import { debounceTime, Observable, of } from 'rxjs';
import { BidvDay } from '@bidv-ui/cdk';
import {
  GetProblemRepositoryParams,
  ProblemRepositoryData,
} from '@app/models/problem';
import { Store } from '@ngrx/store';
import { setProblemData } from 'stores/actions/problem.action';

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
    BidvInputModule,
  ],
  templateUrl: './problem-table.component.html',
  styleUrl: './problem-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemTableComponent implements OnInit {
  private router = inject(Router);
  #problemService = inject(ProblemService);
  #store = inject(Store);

  @Input({ required: true }) courseId!: string | null;
  @Input() userView: boolean = true;
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

  protected filterForm = new FormGroup({
    search: new FormControl(''),
  });

  private problemRepositoryData: ProblemRepositoryData[] = [];

  // Query
  protected params: GetProblemRepositoryParams = {
    page: 1,
    limit: 10,
  };

  protected getActiveProblemsApi: (params: any) => Observable<any> = () =>
    of(null);

  // Lifecycle
  ngOnInit(): void {
    this.createColumnDefs();
    this.initData();
    this.initTableStyle();
  }

  // Init data
  private initData() {
    // Set api
    if (!this.courseId) return;

    if (this.userView) {
      this.getActiveProblemsApi = (params: any) => {
        return this.#problemService.getActiveProblems(
          this.courseId as string,
          params,
        );
      };
    } else {
      this.getActiveProblemsApi = (params: any) => {
        return this.#problemService.getAllProblems(
          this.courseId as string,
          params,
        );
      };
    }

    // Search
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((value) => {
        if (value === null) return;

        if (value.length === 0) {
          delete this.params.search;
          this.params = { ...this.params };
        } else {
          this.params = {
            ...this.params,
            search: value,
          };
        }
      });
  }

  private initTableStyle() {
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
        headerName: 'STT',
        field: 'no',
        width: 80,
        pinned: true,
      },
      {
        headerName: 'Tiêu đề',
        field: 'title',
        flex: 1,
      },
      {
        headerName: 'Trạng thái',
        field: this.userView ? 'status' : 'isActive',
        cellRenderer: StatusComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Điểm',
        field: 'point',
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Độ khó',
        field: 'difficulty',
        cellRenderer: DifficultyComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Cập nhật lúc',
        field: 'updatedAt',
        valueGetter: (params) => {
          const updatedAt = params.data.updatedAt;

          return BidvDay.fromUtcNativeDate(new Date(updatedAt)).getFormattedDay(
            'DMY',
            '/',
          );
        },
        sortable: true,
        width: 150,
      },
    ];
  }

  // Hand
  private onRowClicked(event: RowClickedEvent) {
    if (!this.clickableRow) return;

    const problemId = event.data.id;

    // Store problem
    const clickedProblemData = this.problemRepositoryData.find(
      (problem) => problem.id === problemId,
    );

    if (clickedProblemData) {
      this.#store.dispatch(setProblemData({ problemData: clickedProblemData }));
    }

    this.router.navigate([
      ROUTES.detailCourse,
      this.courseId,
      ROUTES.problem,
      problemId,
    ]);
  }

  protected handleDataReturn(data: ProblemRepositoryData[]) {
    this.problemRepositoryData = data;
  }
}
