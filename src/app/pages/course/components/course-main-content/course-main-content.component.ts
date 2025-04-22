import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { ActiveStatus } from '@app/enums';
import { PaymentMethod } from '@app/enums/payment';
import { DetailCourseData } from '@app/models/course';
import { LectureQueryParams } from '@app/models/lecture';
import { PayBody } from '@app/models/payment';
import { CourseService } from '@app/services/course.service';
import { PaymentService } from '@app/services/payment.service';
import { extractVideoId } from '@app/utils/extract-data';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { BidvAmountPipe } from '@bidv-ui/addon-commerce';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvDialogModule,
  BidvErrorModule,
  BidvSvgModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvFieldErrorPipeModule,
  BidvInputModule,
  BidvSkeletonDirective,
} from '@bidv-ui/kit';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { setCourseData } from 'stores/actions/course.action';

@Component({
  selector: 'app-course-main-content',
  imports: [
    CommonModule,
    BidvSvgModule,
    BidvButtonModule,
    BidvAmountPipe,
    BidvSkeletonDirective,
    BidvDialogModule,
    BidvInputModule,
    ReactiveFormsModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
  ],
  templateUrl: './course-main-content.component.html',
  styleUrl: './course-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
      },
    },
  ],
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
  #alerts = inject(BidvAlertService);

  @Output() shareDetailCourseEvent = new EventEmitter<DetailCourseData>();

  // Data
  private courseId = this.activatedRoute.snapshot.paramMap.get('id') as string;
  protected videoUrl: SafeResourceUrl | null = null;
  protected isPurchased = false;
  protected detailCourse: DetailCourseData | null = null;
  protected invitedInfo = [
    {
      title: 'Mua một lần, học trọn đời',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Cập nhật khóa học liên tục',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Chất lượng video 1080p, 1440p',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Hệ thống bài tập đa dạng',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Hỗ trợ sửa lỗi trong quá trình học',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Cung cấp tài liệu đầy đủ và mã nguồn Github',
      icon: 'bidvIconCheckmark',
    },
  ];

  protected open = false; // Use for dialog when user click buy course

  protected couponForm = new FormGroup({
    code: new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
  });

  // Query
  #getDetailCourseQuery = this.#query({
    queryKey: ['detail-course', this.courseId],
    queryFn: () =>
      this.#courseService.getDetailCourse(this.courseId, {
        isActive: ActiveStatus.Active,
      }),
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
    onError: (err) => {
      this.#alerts
        .open(err.message, {
          status: 'error',
          label: 'Có lỗi xảy ra',
        })
        .subscribe();
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
      this.open = true;
    }
  }

  protected handleBuyCourse() {
    const couponCode = this.couponForm.get('code')?.value;

    const payBody: PayBody = {
      courseId: this.courseId,
      method: PaymentMethod.Stripe, // Hard code
    };

    if (couponCode) {
      payBody.code = couponCode;
    }

    this.#payMutation.mutate(payBody);
  }

  protected handleNavigateProblem() {
    if (this.isPurchased) {
      this.router.navigate([ROUTES.problemRepository], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  protected showDialog(): void {
    this.open = true;
  }

  // Getters
  protected get sanitizedDescription(): SafeHtml | null {
    if (!this.detailCourse?.description) return null;
    return this.sanitizer.bypassSecurityTrustHtml(
      this.detailCourse.description,
    );
  }
}
