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
import { ActivatedRoute, Router } from '@angular/router';
import { LinkItem } from '@app/models';
import {
  CreateLectureBody,
  LectureData,
  UpdateLectureBody,
} from '@app/models/lecture';
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
import { EditorComponent } from '@app/pages/components/editor/editor.component';
import { validateYoutubeUrl } from '@app/utils/form-handling';

interface LectureForm {
  title: FormControl<string>;
  no: FormControl<string>;
  videoUrl: FormControl<string>;
  content: FormControl<string>;
}

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
    EditorComponent,
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
  #activatedRoute = inject(ActivatedRoute);
  #lectureService = inject(LectureService);
  #alerts = inject(BidvAlertService);
  #mutation = injectMutation();

  @Input() lectureData?: LectureData | null = null;

  // Properties
  protected title = '';
  protected breadcrumbs: LinkItem[] = [];

  // Data
  private courseId = this.#activatedRoute.snapshot.queryParams['courseId'];
  private lastNo = this.#activatedRoute.snapshot.queryParams['lastNo'];

  // Form
  protected lectureForm!: FormGroup<LectureForm>;

  // Mutations
  #createLectureMutation = this.#mutation({
    mutationFn: (body: CreateLectureBody) =>
      this.#lectureService.createLecture(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo bài giảng thành công',
        })
        .subscribe();

      // Navigate to lecture list page
      this.#router.navigate([ROUTES.adminLecture]);
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo bài giảng thất bại',
        })
        .subscribe();
    },
  });

  #updateLectureMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateLectureBody }) =>
      this.#lectureService.updateLecture(id, body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật bài giảng thành công',
        })
        .subscribe();

      // Navigate to lecture detail page
      this.#router.navigate([ROUTES.adminLecture, this.lectureData?.id]);
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật bài giảng thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  ngOnInit(): void {
    this.lectureForm = this.initForm();
    this.initUI();
  }

  // Init data
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

  private initForm() {
    return new FormGroup<LectureForm>({
      title: new FormControl(this.lectureData?.title ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      no: new FormControl(
        this.lectureData?.no.toString() ?? (+this.lastNo + 1).toString(),
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(1),
            Validators.max(300),
          ],
        },
      ),
      videoUrl: new FormControl(this.lectureData?.videoUrl ?? '', {
        nonNullable: true,
        validators: [Validators.required, validateYoutubeUrl],
      }),
      content: new FormControl(this.lectureData?.content ?? '', {
        nonNullable: true,
      }),
    });
  }

  // Handlers
  protected handleSubmit(): void {
    if (this.lectureForm.invalid) {
      this.lectureForm.markAllAsTouched();
      return;
    }

    const formValue = this.lectureForm.value;

    const lectureData: Omit<CreateLectureBody | UpdateLectureBody, 'courseId'> =
      {
        title: formValue.title as string,
        no: Number.parseInt(formValue.no as string),
        videoUrl: formValue.videoUrl as string,
        content: formValue.content,
      };

    if (this.lectureData) {
      // Update lecture
      this.#updateLectureMutation.mutate({
        id: this.lectureData.id,
        body: lectureData,
      });
    } else {
      // Create new lecture
      this.#createLectureMutation.mutate({
        ...lectureData,
        courseId: this.courseId,
      } as CreateLectureBody);
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
