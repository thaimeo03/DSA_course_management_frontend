import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LinkItem } from '@app/models';
import { LectureData } from '@app/models/lecture';
import { LectureService } from '@app/services/lecture.service';
import { injectMutation } from '@bidv-api/angular';
import { ROUTES } from '@app/constants/routes';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvDividerDirective,
  BidvFieldErrorPipeModule,
  BidvInputModule,
} from '@bidv-ui/kit';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-lecture-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    BidvInputModule,
    BidvButtonModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
    BidvDividerDirective,
  ],
  templateUrl: './admin-lecture-form.component.html',
  styleUrl: './admin-lecture-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: () => of('Trường này không được để trống'),
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        min: ({ min }: { min: string }) => of(`Giá trị tối thiểu — ${min}`),
        max: ({ max }: { max: string }) => of(`Giá trị tối đa — ${max}`),
        pattern: () => of('Định dạng không hợp lệ'),
      },
    },
  ],
})
export class AdminLectureFormComponent implements OnInit {
  #router = inject(Router);
  #lectureService = inject(LectureService);
  #alerts = inject(BidvAlertService);
  #mutation = injectMutation();

  @Input() courseId?: string | null = null;
  @Input() lectureData?: LectureData | null = null;

  // UI state
  protected isLoading = false;
  protected title = 'Tạo mới bài giảng';
  protected breadcrumbs: LinkItem[] = [];

  // Form
  protected lectureForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    no: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000),
    ]),
    videoUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/).*/,
      ),
    ]),
    content: new FormControl(''),
  });

  // Mutations
  #createLectureMutation = this.#mutation({
    mutationFn: (body: any) => this.#lectureService.createLecture(body),
    onSuccess: (response) => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo bài giảng thành công',
        })
        .subscribe();

      // Navigate to lecture detail page
      this.#router.navigate([ROUTES.adminLecture, response.data.id]);
    },
    onError: (error) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo bài giảng thất bại',
        })
        .subscribe();
    },
  });

  #updateLectureMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      this.#lectureService.updateLecture(id, body),
    onSuccess: (response) => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật bài giảng thành công',
        })
        .subscribe();

      // Navigate to lecture detail page
      this.#router.navigate([ROUTES.adminLecture, response.data.id]);
    },
    onError: (error) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật bài giảng thất bại',
        })
        .subscribe();
    },
  });

  ngOnInit(): void {
    this.initUI();
    this.initForm();
  }

  private initUI(): void {
    if (this.lectureData) {
      // Edit mode
      this.title = 'Cập nhật bài giảng';
      this.breadcrumbs = [
        {
          label: 'Danh sách bài giảng',
          link: ROUTES.adminLecture,
        },
        {
          label: 'Chi tiết bài giảng',
          link: [ROUTES.adminLecture, this.lectureData.id],
        },
        {
          label: 'Cập nhật bài giảng',
        },
      ];
    } else {
      // Create mode
      this.title = 'Tạo mới bài giảng';
      this.breadcrumbs = [
        {
          label: 'Danh sách bài giảng',
          link: ROUTES.adminLecture,
        },
        {
          label: 'Tạo mới bài giảng',
        },
      ];
    }
  }

  private initForm(): void {
    if (this.lectureData) {
      // Fill form with lecture data in edit mode
      this.lectureForm.patchValue({
        title: this.lectureData.title,
        no: this.lectureData.no,
        videoUrl: this.lectureData.videoUrl,
        content: this.lectureData.content || '',
      });
    }
  }

  protected handleSubmit(): void {
    if (this.lectureForm.invalid) {
      this.lectureForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.lectureForm.value;

    const lectureData = {
      title: formValue.title as string,
      no: formValue.no as number,
      videoUrl: formValue.videoUrl as string,
      content: formValue.content as string,
    };

    if (this.lectureData) {
      // Update lecture
      this.#updateLectureMutation.mutate({
        id: this.lectureData.id,
        body: lectureData,
      });
    } else if (this.courseId) {
      // Create new lecture
      this.#createLectureMutation.mutate({
        ...lectureData,
        courseId: this.courseId,
      });
    }
  }

  protected handleCancel(): void {
    if (this.lectureData) {
      // Navigate back to lecture detail
      this.#router.navigate([ROUTES.adminLecture, this.lectureData.id]);
    } else {
      // Navigate back to lecture list
      this.#router.navigate([ROUTES.adminLecture]);
    }
  }
}
