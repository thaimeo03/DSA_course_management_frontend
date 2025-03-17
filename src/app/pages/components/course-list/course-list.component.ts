import { Component, inject, Input, OnInit } from '@angular/core';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { CommonModule } from '@angular/common';
import { BidvPaginationModule } from '@bidv-ui/kit';
import { CourseService } from '@app/services/course.service';
import { CourseData, GetActiveCourseParams } from '@app/models/course';
import { injectQuery, queryOptions } from '@bidv-api/angular';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseItemComponent, BidvPaginationModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  #courseService = inject(CourseService);
  #query = injectQuery();

  @Input() isActive: boolean = true;

  protected courseList: CourseData[] = [];

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
    });
  }

  // Queries
  #getActiveCoursesQuery = this.#query(
    this.getAllActiveCoursesOptions(this.params),
  );

  ngOnInit(): void {
    this.initData();
  }

  // Init Data
  private initData() {
    if (this.isActive) {
      this.#getActiveCoursesQuery.result$.subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.courseList = data.data;
        this.pageCount = data.pagination.totalPage;
        this.currentPageIndex = data.pagination.currentPage - 1;
      });
    }
  }

  protected goToPage(pageIndex: number) {
    this.#getActiveCoursesQuery.updateOptions(
      this.getAllActiveCoursesOptions({
        ...this.params,
        page: pageIndex + 1,
      }),
    );
  }
}
