import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HavePagination } from '@app/enums';
import { LinkItem, SelectItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseService } from '@app/services/course.service';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import {
  BidvButtonModule,
  BidvDataListModule,
  BidvValueContentContext,
} from '@bidv-ui/core';
import { BidvSelectModule } from '@bidv-ui/kit';
import { SingleSelectDropdownComponent } from '@app/pages/components/single-select-dropdown/single-select-dropdown.component';
import { BidvDay, BidvStringHandler } from '@bidv-ui/cdk';
import { LectureService } from '@app/services/lecture.service';
import {
  ColDef,
  ColGroupDef,
  GridOptions,
  RowClickedEvent,
} from 'ag-grid-community';
import { BaseTableComponent } from '@app/pages/components/base-table/base-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ROUTES } from '@app/constants/routes';
import { AdminLectureStatusCellComponent } from './components/admin-lecture-status-cell/admin-lecture-status-cell.component';

interface FilterForm {
  course: FormControl<SelectItem | null>;
}

@Component({
  selector: 'app-admin-lecture-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvSelectModule,
    SingleSelectDropdownComponent,
    BidvDataListModule,
    BaseTableComponent,
  ],
  templateUrl: './admin-lecture-list.component.html',
  styleUrl: './admin-lecture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureListComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #query = injectQuery();
  #courseService = inject(CourseService);
  #lectureService = inject(LectureService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
    },
  ];

  protected courseItems: SelectItem[] = [];

  // Data
  protected filterForm = new FormGroup<FilterForm>({
    course: new FormControl(null),
  });

  protected renderedRowData: any[] | null = null;

  // Table config
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

  // Query options
  protected getAllLecturesOptions = (courseId: string | null) =>
    queryOptions({
      enabled: !!courseId,
      queryKey: ['all-lectures', courseId],
      queryFn: () => {
        if (!courseId) return null;
        return this.#lectureService.getAllLectures(courseId);
      },
      refetchOnWindowFocus: false,
    });

  // Queries
  #getAllCoursesQuery = this.#query({
    queryKey: ['all-courses'],
    queryFn: () =>
      this.#courseService.getAllCourses({ paging: HavePagination.N }),
  });

  #getAllLecturesQuery = this.#query(this.getAllLecturesOptions(null));

  protected getAllLecturesResult = this.#getAllLecturesQuery.result;

  // Lifecycle
  constructor() {
    this.initCourseData();
    this.trackFilter();
    this.createColumnDefs();
  }

  // Init data
  private initCourseData() {
    this.#getAllCoursesQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        const courses = res.data.data;
        this.courseItems = courses.map((course) => ({
          label: course.title,
          value: course.id,
        }));
      });

    this.#getAllLecturesQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        const lecturesData = res.data.data;
        this.renderedRowData = lecturesData.map((item) => ({
          id: item.id,
          no: item.no,
          title: item.title,
          isActive: item.isActive ? 'Có' : 'Không',
          updatedAt: BidvDay.fromLocalNativeDate(
            new Date(item.updatedAt),
          ).getFormattedDay('DMY', '/'),
        }));

        this.#cdr.markForCheck();
      });
  }

  // Init table configuration
  private createColumnDefs() {
    this.columnDefs = [
      {
        field: 'id',
        hide: true,
      },
      {
        headerName: '#',
        field: 'no',
        width: 80,
        pinned: true,
      },
      {
        headerName: 'Tên bài giảng',
        field: 'title',
        width: 400,
        cellStyle: {
          fontWeight: '500',
        },
      },
      {
        headerName: 'Kích hoạt',
        field: 'isActive',
        cellRenderer: AdminLectureStatusCellComponent,
        sortable: true,
        width: 150,
      },
      {
        headerName: 'Ngày cập nhật',
        field: 'updatedAt',
        sortable: true,
        flex: 1,
      },
    ];
  }

  // Handlers
  private trackFilter() {
    this.filterForm.get('course')?.valueChanges.subscribe((item) => {
      if (!item) return;

      this.#getAllLecturesQuery.updateOptions(
        this.getAllLecturesOptions(item.value),
      );

      this.#cdr.markForCheck();
    });
  }

  protected navigateToCreateLecture() {
    this.#router.navigate([ROUTES.adminCreateLecture]);
  }

  private onRowClicked(event: RowClickedEvent) {
    const { id } = event.data;
    this.#router.navigate([ROUTES.adminLecture, id]);
  }

  // Helpers
  protected readonly courseContent: BidvStringHandler<
    BidvValueContentContext<SelectItem>
  > = ({ $implicit }) => {
    return $implicit.label;
  };
}
