import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { BadgeItem, LinkItem } from '@app/models';
import { CourseData, GetDetailCourseParams } from '@app/models/course';
import { CourseService } from '@app/services/course.service';
import { extractVideoId } from '@app/utils/extract-data';
import { injectMutation, injectQuery, queryOptions } from '@bidv-api/angular';
import { BidvAmountPipe } from '@bidv-ui/addon-commerce';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvSvgModule,
} from '@bidv-ui/core';
import { BidvBadgeModule, BidvSkeletonDirective } from '@bidv-ui/kit';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { ActiveStatus } from '@app/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/services/share/dialog.service';

@Component({
  selector: 'app-admin-course-detail',
  imports: [
    CommonModule,
    BidvSvgModule,
    BidvButtonModule,
    BidvAmountPipe,
    BidvSkeletonDirective,
    BreadcrumbsComponent,
    BidvBadgeModule,
  ],
  templateUrl: './admin-course-detail.component.html',
  styleUrl: './admin-course-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseDetailComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private courseService = inject(CourseService);
  private query = injectQuery();
  private mutation = injectMutation();
  private alerts = inject(BidvAlertService);
  private dialogs = inject(DialogService);
  private titleService = inject(Title);
  #destroyRef = inject(DestroyRef);

  // Breadcrumbs
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách khóa học',
      link: ROUTES.adminCourse,
    },
    {
      label: 'Chi tiết khóa học',
    },
  ];

  // Data
  protected courseId = this.activatedRoute.snapshot.paramMap.get(
    'id',
  ) as string;
  protected videoUrl: SafeResourceUrl | null = null;
  protected detailCourse: CourseData | null = null;
  protected isActive!: boolean;

  protected badgeItems: { [key: string]: BadgeItem } = {
    active: {
      label: 'Đã kích hoạt',
      value: '',
      class: 'badge-green',
    },
    inactive: {
      label: 'Chưa kích hoạt',
      value: '',
      class: 'badge-red',
    },
  };

  // Query Options
  protected getCourseDetailOptions = (params: GetDetailCourseParams | null) =>
    queryOptions({
      enabled: !!params,
      queryKey: ['admin-course-detail', this.courseId, params],
      queryFn: () => {
        if (!params) return null;
        return this.courseService.getDetailCourse(this.courseId, params);
      },
      refetchOnWindowFocus: false,
    });

  // Queries
  #getCourseDetailQuery = this.query(this.getCourseDetailOptions(null));

  // Mutations
  #deleteCourseMutation = this.mutation({
    mutationFn: () => {
      return this.courseService.deleteCourse(this.courseId);
    },
    onSuccess: () => {
      // Redirect to course list
      this.router.navigate([ROUTES.adminCourse]);

      this.alerts
        .open('', {
          status: 'success',
          label: 'Xóa khóa học học thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.alerts
        .open('', {
          status: 'error',
          label: 'Xóa khóa học thất bại',
        })
        .subscribe();
    },
  });

  #activeCourseMutation = this.mutation({
    mutationFn: () => {
      return this.courseService.activeCourse(this.courseId);
    },
    onSuccess: () => {
      this.isActive = true;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          active: ActiveStatus.Active,
        },
        queryParamsHandling: 'merge',
      });

      this.alerts
        .open('', {
          status: 'success',
          label: 'Kích hoạt khóa học thành công',
        })
        .subscribe();

      this.cdr.markForCheck();
    },
    onError: () => {
      this.alerts
        .open('', {
          status: 'error',
          label: 'Kích hoạt khóa học thất bại',
        })
        .subscribe();
    },
  });

  #inactiveCourseMutation = this.mutation({
    mutationFn: () => {
      return this.courseService.inactiveCourse(this.courseId);
    },
    onSuccess: () => {
      this.isActive = false;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          active: ActiveStatus.Inactive,
        },
        queryParamsHandling: 'merge',
      });

      this.alerts
        .open('', {
          status: 'success',
          label: 'Hủy kích hoạt khóa học thành công',
        })
        .subscribe();

      this.cdr.markForCheck();
    },
    onError: () => {
      this.alerts
        .open('', {
          status: 'error',
          label: 'Hủy kích hoạt khóa học thất bại',
        })
        .subscribe();
    },
  });

  #archiveCourseMutation = this.mutation({
    mutationFn: () => {
      return this.courseService.archiveCourse(this.courseId);
    },
    onSuccess: () => {
      // Redirect to course list
      this.router.navigate([ROUTES.adminCourse]);

      this.alerts
        .open('', {
          status: 'success',
          label: 'Lưu trữ khóa học học thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.alerts
        .open('', {
          status: 'error',
          label: 'Lưu trữ khóa học thất bại',
        })
        .subscribe();
    },
  });

  protected deleteCourseResult = this.#deleteCourseMutation.result;
  protected activeCourseResult = this.#activeCourseMutation.result;
  protected inactiveCourseResult = this.#inactiveCourseMutation.result;
  protected archiveCourseResult = this.#archiveCourseMutation.result;

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

        this.detailCourse = data.data as CourseData;

        this.titleService.setTitle(this.detailCourse.title);

        if (this.detailCourse.videoUrl) {
          this.videoUrl = this.initVideo(this.detailCourse.videoUrl);
        }

        this.cdr.markForCheck();
      });
  }

  private trackParams() {
    const active = this.activatedRoute.snapshot.queryParams['active'] as
      | ActiveStatus
      | undefined;

    if (!active) return;

    this.isActive = active === ActiveStatus.Active;
    this.#getCourseDetailQuery.updateOptions(
      this.getCourseDetailOptions({ isActive: active }),
    );
  }

  // Display video
  private initVideo(url: string) {
    const videoId = extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  // Handlers
  protected handleDeleteCourse() {
    this.dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#deleteCourseMutation.mutate(null);
      });
  }

  protected handleActivateCourse() {
    this.dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn kích hoạt khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#activeCourseMutation.mutate(null);
      });
  }

  protected handleDeactivateCourse() {
    this.dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn hủy kích hoạt khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#inactiveCourseMutation.mutate(null);
      });
  }

  protected handleArchiveCourse() {
    this.dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn lưu trữ khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#archiveCourseMutation.mutate(null);
      });
  }

  // Getters
  protected get sanitizedDescription(): SafeHtml | null {
    if (!this.detailCourse?.description) return null;
    return this.sanitizer.bypassSecurityTrustHtml(
      this.detailCourse.description,
    );
  }

  protected get badgeItem(): BadgeItem {
    return this.isActive
      ? this.badgeItems['active']
      : this.badgeItems['inactive'];
  }
}
