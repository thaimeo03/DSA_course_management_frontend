import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AdminCourseFormComponent } from '../components/admin-course-form/admin-course-form.component';
import { DetailCourseData, GetDetailCourseParams } from '@app/models/course';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import { CourseService } from '@app/services/course.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActiveStatus } from '@app/enums';

@Component({
  selector: 'app-admin-course-edit',
  imports: [CommonModule, AdminCourseFormComponent],
  templateUrl: './admin-course-edit.component.html',
  styleUrl: './admin-course-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseEditComponent {
  #activatedRoute = inject(ActivatedRoute);
  #titleService = inject(Title);
  #courseService = inject(CourseService);
  #query = injectQuery();
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);

  // Data
  protected courseId = this.#activatedRoute.snapshot.paramMap.get(
    'id',
  ) as string;
  protected detailCourse: DetailCourseData | null = null;

  // Query Options
  protected getCourseDetailOptions = (params: GetDetailCourseParams | null) =>
    queryOptions({
      enabled: !!params,
      queryKey: ['admin-course-detail', this.courseId, params],
      queryFn: () => {
        if (!params) return null;
        return this.#courseService.getDetailCourse(this.courseId, params);
      },
      refetchOnWindowFocus: false,
    });

  // Queries
  #getCourseDetailQuery = this.#query(this.getCourseDetailOptions(null));

  constructor() {
    this.initData();
  }

  ngOnInit(): void {
    this.trackParams();
  }

  // Init data
  private initData() {
    this.#getCourseDetailQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.detailCourse = data.data;

        this.#titleService.setTitle(this.detailCourse.title);

        this.#cdr.markForCheck();
      });
  }

  private trackParams() {
    const active = this.#activatedRoute.snapshot.queryParams['active'] as
      | ActiveStatus
      | undefined;

    if (!active) return;

    this.#getCourseDetailQuery.updateOptions(
      this.getCourseDetailOptions({ isActive: active }),
    );
  }
}
