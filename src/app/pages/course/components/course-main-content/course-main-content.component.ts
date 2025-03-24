import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { PaymentMethod } from '@app/enums/payment';
import { DetailCourseData } from '@app/models/course';
import { LectureQueryParams } from '@app/models/lecture';
import { PayBody } from '@app/models/payment';
import { CourseService } from '@app/services/course.service';
import { PaymentService } from '@app/services/payment.service';
import { extractVideoId } from '@app/utils/extract-data';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { BidvAmountPipe } from '@bidv-ui/addon-commerce';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';
import { BidvSkeletonDirective } from '@bidv-ui/kit';
import { Store } from '@ngrx/store';
import { setCourseData } from 'stores/actions/course.action';

@Component({
  selector: 'app-course-main-content',
  imports: [
    CommonModule,
    BidvSvgModule,
    BidvButtonModule,
    BidvAmountPipe,
    BidvSkeletonDirective,
  ],
  templateUrl: './course-main-content.component.html',
  styleUrl: './course-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrouseMainContentComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  #courseService = inject(CourseService);
  #paymentService = inject(PaymentService);
  #query = injectQuery();
  #mutation = injectMutation();
  #store = inject(Store);

  @Output() shareDetailCourseEvent = new EventEmitter<DetailCourseData>();

  // Data
  private courseId = this.activatedRoute.snapshot.paramMap.get('id') as string;
  protected videoUrl: SafeResourceUrl | null = null;
  protected isPurchased = false;
  protected detailCourse: DetailCourseData | null = null;
  protected invitedInfo = [
    {
      title: 'Buy once, learn for life',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Continuous course updates',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Video quality 1080p, 1440p',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Diverse exercise system',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Support to fix bugs while studying',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Provide complete documentation and Github source code',
      icon: 'bidvIconCheckmark',
    },
  ];

  // Query
  #getDetailCourseQuery = this.#query({
    queryKey: ['detail-course', this.courseId],
    queryFn: () =>
      this.#courseService.getDetailCourse(this.courseId, { isActive: '1' }),
  });

  #isPurchasedQuery = this.#query({
    queryKey: ['is-purchased'],
    queryFn: () => this.#courseService.isPurChasedCourse(this.courseId),
  });

  protected isPurchaseQueryResult = this.#isPurchasedQuery.result;

  // Mutation
  #payMutation = this.#mutation({
    mutationFn: (body: PayBody) => this.#paymentService.pay(body),
    onSuccess: (res) => {
      const url = res.data.url;
      window.location.replace(url);
    },
  });
  protected payMutationResult = this.#payMutation.result;

  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.#getDetailCourseQuery.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      this.detailCourse = data.data;
      this.shareDetailCourseEvent.emit(this.detailCourse);

      if (this.detailCourse.videoUrl) {
        this.videoUrl = this.initVideo(this.detailCourse.videoUrl);
      }

      this.cdr.markForCheck();
    });

    this.#isPurchasedQuery.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      this.isPurchased = data.data;
      this.#store.dispatch(setCourseData({ isPurchased: this.isPurchased }));

      this.cdr.markForCheck();
    });
  }

  // Display video
  private initVideo(url: string) {
    const videoId = extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  // Handlers
  protected handleAction() {
    if (this.isPurchased) {
      const queryParams: LectureQueryParams = { no: 1 };

      this.router.navigate([ROUTES.lecture], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
      });
    } else {
      this.#payMutation.mutate({
        courseId: this.courseId,
        method: PaymentMethod.Stripe, // Hard code
      });
    }
  }

  protected handleNavigateProblem() {
    if (this.isPurchased) {
      this.router.navigate([ROUTES.problemRepository], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
