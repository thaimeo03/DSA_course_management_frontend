import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  injectQuery,
  injectQueryClient,
  QueryObserverResult,
  queryOptions,
} from '@bidv-api/angular';
import { BidvButtonModule, BidvLoaderModule } from '@bidv-ui/core';
import { BidvBadgeModule, BidvPaginationSelectPageModule } from '@bidv-ui/kit';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
  RowClickedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { NoDataComponent } from './components/no-data/no-data.component';
import { Observable } from 'rxjs';
import { Result } from 'node_modules/@bidv-api/angular/build/lib/types';
import { ProblemRepositoryResponse } from '@app/models/problem';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [
    CommonModule,
    BidvButtonModule,
    BidvBadgeModule,
    AgGridAngular,
    BidvPaginationSelectPageModule,
    BidvLoaderModule,
    NoDataComponent,
  ],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BaseTableComponent implements OnChanges {
  // Dependencies
  private cdr = inject(ChangeDetectorRef);
  private destroyedRef = inject(DestroyRef);
  private readonly query = injectQuery();
  private readonly queryClient = injectQueryClient();

  // Inputs and Outputs
  @Input() renderedRowData!: any[]; // Only used for fake data or show empty data
  @Input() tableIconSrc = '';
  @Input() tableTitle = '';
  @Input() columnDefs: ColDef[] | null = null;
  @Input() defaultColDef: ColDef = {
    resizable: false,
    sortable: false,
    suppressMovable: true,
    unSortIcon: true,
  };
  @Input() gridOptions: GridOptions = {};
  @Input() rowHeight = 50;
  @Input() queryKey = '';
  @Input() api!: (params: any) => Observable<any>;
  @Input() params: any = null;
  @Input() itemPages: Array<{ value: number; label: string }> = [
    { value: 10, label: '10 / trang' },
    { value: 20, label: '20 / trang' },
    { value: 50, label: '50 / trang' },
    { value: 100, label: '100 / trang' },
  ];
  @Input() haveHeaderButton = true;
  @Input() enableCount = true;
  @Input() noDataDescription = '';
  @Input() hiddenPagination = true;

  @Output() dataReturn = new EventEmitter<any>();
  @Output() queryCompleted = new EventEmitter<boolean>();

  // Grid state
  public isRowSelected = false;
  public rowData: any[] = [];
  public overlayNoRowsTemplate =
    '<span style="padding: 10px; background: white;">Không có dữ liệu</span>';

  // Pagination and filtering state
  protected pageIndex = 0;
  protected itemPerPages = 10;
  protected totalPage = 0;
  protected totalElements = 0;

  #featureQuery!: Result<QueryObserverResult<any, Error>>;
  protected featureQueryResult$!: Observable<QueryObserverResult<any, Error>>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['params'] && this.params) {
      this.updateParams(this.params);

      if (!this.#featureQuery) {
        this.initializeQuery();
      } else {
        this.fetchData();
      }
    }
    if (changes['renderedRowData'] && this.renderedRowData) {
      this.rowData = this.renderedRowData;
    }
  }

  private initializeQuery(): void {
    this.#featureQuery = this.query(this.getQueryOptions(this.params));
    this.featureQueryResult$ = this.#featureQuery.result$;

    this.#featureQuery.result$
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((res: any) => {
        if (!res.data) return;
        this.handleApiResponse(res.data);
      });
  }

  private handleApiResponse(res: ProblemRepositoryResponse): void {
    const pagination = res.pagination;

    const noPivot = (pagination.currentPage - 1) * pagination.limit + 1;

    this.rowData = res.data.map((item, i) => {
      return {
        no: noPivot + i,
        ...item,
      };
    });
    this.totalPage = pagination.totalPage;
    this.totalElements = pagination.totalElements;

    this.dataReturn.emit(res.data);
    this.queryCompleted.emit(true);

    this.cdr.markForCheck();
  }

  private fetchData(): void {
    if (!this.api) return;
    if (this.#featureQuery) {
      this.#featureQuery.updateOptions(this.getQueryOptions(this.params));
    }
    this.isRowSelected = false;
  }

  private updateParams(params: any): void {
    this.pageIndex = 0;
    this.params = { ...params, pageNum: this.pageIndex + 1 };
  }

  private getQueryOptions(params: any) {
    return queryOptions({
      enabled: !!params,
      queryKey: [this.queryKey, params] as const,
      staleTime: 1000,
      refetchOnWindowFocus: false,
      retry: 0,
      queryFn: () => {
        return this.api(params);
      },
    });
  }

  public triggerFetchData() {
    if (this.#featureQuery) {
      this.queryClient.refetchQueries({
        queryKey: [this.queryKey, this.params],
      });
    }
    this.isRowSelected = false;
  }

  // Pagination controls
  selectPage(itemPerPages: any): void {
    this.itemPerPages = itemPerPages;
    this.params = {
      ...this.params,
      limit: itemPerPages,
    };
    this.fetchData();
  }

  goToPage(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.params = {
      ...this.params,
      page: pageIndex + 1,
    };

    this.fetchData();
  }

  onRowClicked(event: RowClickedEvent): void {
    this.isRowSelected = event.api.getSelectedRows().length > 0;
    this.cdr.detectChanges();
  }

  onRowSelected(event: RowSelectedEvent): void {
    this.isRowSelected = event.api.getSelectedRows().length > 0;
    this.cdr.detectChanges();
  }
}
