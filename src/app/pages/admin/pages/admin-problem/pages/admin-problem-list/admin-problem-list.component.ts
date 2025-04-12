import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HavePagination } from '@app/enums';
import { LinkItem, SelectItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseService } from '@app/services/course.service';
import { ProblemService } from '@app/services/problem.service';
import { injectQuery } from '@bidv-api/angular';
import {
  BidvButtonModule,
  BidvDataListModule,
  BidvValueContentContext,
} from '@bidv-ui/core';
import { BidvSelectModule } from '@bidv-ui/kit';
import { SingleSelectDropdownComponent } from '@app/pages/components/single-select-dropdown/single-select-dropdown.component';
import { BidvStringHandler } from '@bidv-ui/cdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ROUTES } from '@app/constants/routes';
import { ProblemTableComponent } from '@app/pages/components/problem-table/problem-table.component';

interface FilterForm {
  course: FormControl<SelectItem | null>;
}

@Component({
  selector: 'app-admin-problem-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvSelectModule,
    SingleSelectDropdownComponent,
    BidvDataListModule,
    ProblemTableComponent,
  ],
  templateUrl: './admin-problem-list.component.html',
  styleUrl: './admin-problem-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemListComponent {
  #router = inject(Router);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #query = injectQuery();
  #courseService = inject(CourseService);
  #problemService = inject(ProblemService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài tập',
    },
  ];

  protected courseItems: SelectItem[] = [];

  // Data
  protected filterForm = new FormGroup<FilterForm>({
    course: new FormControl(null),
  });

  protected courseId = '';
  protected courseChangeTracker = true;

  // Queries
  #getAllCoursesQuery = this.#query({
    queryKey: ['all-courses'],
    queryFn: () =>
      this.#courseService.getAllCourses({ paging: HavePagination.N }),
  });

  // Lifecycle
  constructor() {
    this.initCourseData();
    this.trackFilter();
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
  }

  // Handlers
  private trackFilter() {
    this.filterForm.get('course')?.valueChanges.subscribe((item) => {
      if (!item) return;

      // Khi courseId thay đổi, đặt courseChangeTracker = false trước
      this.courseChangeTracker = false;
      this.courseId = item.value;

      // Sau đó đặt lại = true để tạo lại component
      setTimeout(() => {
        this.courseChangeTracker = true;
        this.#cdr.markForCheck();
      }, 0);

      this.#cdr.markForCheck();
    });
  }

  protected navigateToCreateProblem() {
    this.#router.navigate([ROUTES.adminCreateProblem], {
      queryParams: {
        courseId: this.courseId,
      },
    });
  }

  // Helpers
  protected readonly courseContent: BidvStringHandler<
    BidvValueContentContext<SelectItem>
  > = ({ $implicit }) => {
    return $implicit.label;
  };
}
