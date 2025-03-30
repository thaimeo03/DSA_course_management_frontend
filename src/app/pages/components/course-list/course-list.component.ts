import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { CommonModule } from '@angular/common';
import { BidvPaginationModule } from '@bidv-ui/kit';
import { CourseService } from '@app/services/course.service';
import {
  CourseData,
  GetActiveCourseParams,
  GetPurchasedCoursesParams,
} from '@app/models/course';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import {
  SortingChangeEvent,
  SortingComponent,
} from './components/sorting/sorting.component';
import { CourseType } from '@app/enums/course';

@Component({
  selector: 'app-course-list',
  imports: [
    CommonModule,
    CourseItemComponent,
    BidvPaginationModule,
    SortingComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  #courseService = inject(CourseService);
  #cdr = inject(ChangeDetectorRef);
  #query = injectQuery();

  @Input({ required: true }) type!: CourseType;
  @Input() enableSorting: boolean = true;
  @Input() enablePagination: boolean = true;

  protected courseList: CourseData[] = [];
  protected isPurchased: boolean = false;

  private params: GetActiveCourseParams = {
    page: 1,
    limit: 8,
  };
  protected pageCount = 0;
  protected currentPageIndex = 0;

  // Query Options
  private getAllActiveCoursesOptions(params: GetActiveCourseParams) {
    return queryOptions({
      queryKey: ['active-courses', params],
      queryFn: () => this.#courseService.getAllActiveCourses(params),
      refetchOnWindowFocus: false,
    });
  }

  private getPurChasedCoursesOptions(params: GetPurchasedCoursesParams) {
    return queryOptions({
      queryKey: ['active-courses', params],
      queryFn: () => this.#courseService.getPurchasedCourses(params),
      refetchOnWindowFocus: false,
    });
  }

  // Queries
  #getActiveCoursesQuery = this.#query(
    this.getAllActiveCoursesOptions(this.params),
  );

  #getPurchasedCoursesQuery = this.#query(
    this.getPurChasedCoursesOptions(this.params),
  );

  private courseTypeHandlers: Record<CourseType, any> = {
    [CourseType.ACTIVE]: {
      query: this.#getActiveCoursesQuery,
      getOptions: (params: GetActiveCourseParams) =>
        this.getAllActiveCoursesOptions(params),
    },
    [CourseType.PURCHASED]: {
      query: this.#getPurchasedCoursesQuery,
      getOptions: (params: GetPurchasedCoursesParams) =>
        this.getPurChasedCoursesOptions(params),
    },
    [CourseType.ALL]: {
      query: this.#getActiveCoursesQuery,
      getOptions: (params: GetActiveCourseParams) =>
        this.getAllActiveCoursesOptions(params),
    },
  };

  ngOnInit(): void {
    this.initData();
  }

  // Init Data
  private initData() {
    const handler = this.courseTypeHandlers[this.type];
    if (!handler) return;

    this.isPurchased = this.type === CourseType.PURCHASED;

    handler.query.result$.subscribe((res: any) => {
      const data = res.data;
      if (!data) return;

      this.courseList = data.data;
      this.pageCount = data.pagination.totalPage;
      this.currentPageIndex = data.pagination.currentPage - 1;

      this.#cdr.markForCheck();
    });
  }

  // Sorting
  protected handleSortingChange(sortingChangeEvent: SortingChangeEvent) {
    const handler = this.courseTypeHandlers[this.type];
    if (!handler) return;

    handler.query.updateOptions(
      handler.getOptions({
        ...this.params,
        sortBy: sortingChangeEvent.field,
        order: sortingChangeEvent.order,
      }),
    );
  }

  // Pagination
  protected goToPage(pageIndex: number) {
    const handler = this.courseTypeHandlers[this.type];
    if (!handler) return;

    handler.query.updateOptions(
      handler.getOptions({
        ...this.params,
        page: pageIndex + 1,
      }),
    );
  }
}
