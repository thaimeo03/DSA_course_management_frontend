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
import { injectMutation } from '@bidv-api/angular';
import { ErrorResponse, LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseService } from '@app/services/course.service';
import { ImageService } from '@app/services/image.service';
import { of } from 'rxjs';
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
  BidvFileLike,
  BidvFilesModule,
  BidvInputModule,
} from '@bidv-ui/kit';
import { SingleFileUploadComponent } from '@app/pages/components/single-file-upload/single-file-upload.component';
import { BidvEditorModule } from '@bidv-ui/addon-editor';
import { validateYoutubeUrl } from '@app/utils/form-handling';
import {
  CreateCourseBody,
  DetailCourseData,
  UpdateCourseBody,
} from '@app/models/course';
import { ROUTES } from '@app/constants/routes';
import { ImageFolder } from '@app/enums/image';
import { DialogService } from '@app/services/share/dialog.service';
import { EditorComponent } from '@app/pages/components/editor/editor.component';
import { ActiveStatus } from '@app/enums';

@Component({
  selector: 'app-admin-course-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvInputModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
    BidvDividerDirective,
    BidvFilesModule,
    SingleFileUploadComponent,
    BidvEditorModule,
    EditorComponent,
  ],
  templateUrl: './admin-course-form.component.html',
  styleUrl: './admin-course-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'Trường này là bắt buộc',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        min: ({ min }: { min: string }) => of(`Giá trị tối thiểu — ${min}`),
        invalidYoutubeUrl: 'URL không đúng định dạng YouTube',
      },
    },
  ],
})
export class AdminCourseFormComponent implements OnInit {
  #router = inject(Router);
  #courseService = inject(CourseService);
  #imageService = inject(ImageService);
  #mutation = injectMutation();
  #alerts = inject(BidvAlertService);
  #dialogs = inject(DialogService);

  @Input() detailCourse: DetailCourseData | null = null;

  // Data
  protected isUploading = false;
  protected maxMBFileSize = 5; // MB
  protected acceptedFileTypes = ['image/jpeg', 'image/png'];
  protected thumbnailSrc: string | null = null;

  protected breadcrumbs: LinkItem[] = [];
  protected title = '';

  protected courseForm!: FormGroup;

  // Mutations
  #createCourseMutation = this.#mutation({
    mutationFn: (body: CreateCourseBody) =>
      this.#courseService.createCourse(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo khóa học thành công',
        })
        .subscribe();

      this.#router.navigate([ROUTES.adminCourse]);
    },
    onError: (error: ErrorResponse) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: error.error.message,
        })
        .subscribe();
    },
  });

  #updateCourseMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCourseBody }) =>
      this.#courseService.updateCourse(id, body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật khóa học thành công',
        })
        .subscribe();

      this.#router.navigate([ROUTES.adminCourse]);
    },
    onError: (error: ErrorResponse) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: error.error.message,
        })
        .subscribe();
    },
  });

  // Upload thumbnail first, then create course
  #createCourseWithThumbnailMutation = (courseData: CreateCourseBody) =>
    this.#mutation({
      mutationFn: (files: BidvFileLike[]) =>
        this.#imageService.uploadImages(files as File[], ImageFolder.Course),
      onSuccess: (res) => {
        this.isUploading = false;
        const thumbnailUrl = res.data[0];

        // Create course with thumbnail URL
        this.#createCourseMutation.mutate({
          ...courseData,
          thumbnail: thumbnailUrl,
        });
      },
      onError: (error: ErrorResponse) => {
        this.isUploading = false;

        this.#alerts
          .open('', {
            status: 'error',
            label: error.error.message,
          })
          .subscribe();
      },
    });

  #updateCourseWithThumbnailMutation = ({
    id,
    body,
  }: {
    id: string;
    body: UpdateCourseBody;
  }) =>
    this.#mutation({
      mutationFn: (files: BidvFileLike[]) =>
        this.#imageService.uploadImages(files as File[], ImageFolder.Course),
      onSuccess: (res) => {
        this.isUploading = false;
        const thumbnailUrl = res.data[0];

        // Create course with thumbnail URL
        this.#updateCourseMutation.mutate({
          id,
          body: {
            ...body,
            thumbnail: thumbnailUrl,
          },
        });
      },
      onError: (error: ErrorResponse) => {
        this.isUploading = false;

        this.#alerts
          .open('', {
            status: 'error',
            label: error.error.message,
          })
          .subscribe();
      },
    });

  protected createCourseResult = this.#createCourseMutation.result;

  ngOnInit(): void {
    this.courseForm = this.initForm();
    this.trackThumbnail();
    this.initUI();
  }

  // Init data
  private initForm() {
    const title = this.detailCourse?.title ?? '';
    const description = this.detailCourse?.description ?? '';
    const price = this.detailCourse?.price ?? null;
    const videoUrl = this.detailCourse?.videoUrl ?? '';

    return new FormGroup({
      title: new FormControl(title, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ]),
      description: new FormControl(description),
      price: new FormControl<number | null>(price, [
        Validators.required,
        Validators.min(15000),
      ]),
      videoUrl: new FormControl(videoUrl, [
        Validators.required,
        validateYoutubeUrl,
      ]),
      thumbnail: new FormControl<BidvFileLike | null>(
        null,
        !this.detailCourse ? [Validators.required] : [],
      ),
    });
  }

  private initUI() {
    if (!this.detailCourse) {
      this.breadcrumbs = [
        {
          label: 'Danh sách khóa học',
          link: ROUTES.adminCourse,
        },
        {
          label: 'Tạo mới khóa học',
        },
      ];

      this.title = 'Tạo mới khóa học';
    } else {
      this.breadcrumbs = [
        {
          label: 'Danh sách khóa học',
          link: ROUTES.adminCourse,
        },
        {
          label: 'Chi tiết khóa học',
          link: [ROUTES.adminCourse, this.detailCourse.id],
          queryParams: {
            active: ActiveStatus.Inactive,
          },
        },
        {
          label: 'Cập nhật khóa học',
        },
      ];

      this.title = 'Cập nhật khóa học';
    }
  }

  // Handlers
  private trackThumbnail() {
    this.thumbnailSrc = this.detailCourse?.thumbnail ?? null;

    this.thumbnailControl.valueChanges.subscribe((file) => {
      if (!file) {
        this.thumbnailSrc = this.detailCourse?.thumbnail ?? null;
        return;
      }

      this.thumbnailSrc = URL.createObjectURL(file);
    });
  }

  protected async handleSubmitCourse() {
    // Mark all fields as touched for validation
    this.courseForm.markAllAsTouched();

    if (this.courseForm.invalid) {
      return;
    }

    this.#dialogs
      .openConfirmDialog(
        `Bạn có chắc chắn muốn ${this.detailCourse ? 'cập nhật' : 'tạo'} khóa học này?`,
      )
      .subscribe((status: any) => {
        if (!status) return;

        const formValue = this.courseForm.value;
        const thumbnail = formValue.thumbnail;

        const body: CreateCourseBody | UpdateCourseBody = {
          title: formValue.title as string,
          thumbnail: this.detailCourse?.thumbnail ?? '',
          description: formValue.description as string,
          price: Number.parseInt(formValue.price as any),
          videoUrl: formValue.videoUrl as string,
        };

        if (!this.detailCourse) {
          // Create new course
          this.isUploading = true;

          this.#createCourseWithThumbnailMutation(
            body as CreateCourseBody,
          ).mutate([thumbnail as File]);
        } else {
          // Update course
          this.isUploading = true;

          if (!thumbnail) {
            this.#updateCourseMutation.mutate({
              id: this.detailCourse.id,
              body,
            });
            return;
          } else {
            this.#updateCourseWithThumbnailMutation({
              id: this.detailCourse.id,
              body: body as UpdateCourseBody,
            }).mutate([thumbnail as File]);
          }
        }
      });
  }

  protected handleCancel() {
    this.#router.navigate([ROUTES.adminCourse]);
  }

  // Getters
  protected get thumbnailControl() {
    return this.courseForm.get('thumbnail') as FormControl;
  }

  protected get descriptionControl() {
    return this.courseForm.get('description') as FormControl;
  }
}
