import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  INJECTOR,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { injectMutation } from '@bidv-api/angular';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseService } from '@app/services/course.service';
import { ImageService } from '@app/services/image.service';
import { of } from 'rxjs';
import {
  BIDV_SANITIZER,
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
import {
  BidvEditorModule,
  BIDV_EDITOR_EXTENSIONS,
  BIDV_EDITOR_DEFAULT_EXTENSIONS,
  BidvEditorTool,
} from '@bidv-ui/addon-editor';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { validateYoutubeUrl } from '@app/utils/form-handling';
import { CreateCourseBody } from '@app/models/course';
import { ROUTES } from '@app/constants/routes';
import { ImageFolder } from '@app/enums/image';
import { DialogService } from '@app/services/share/dialog.service';

@Component({
  selector: 'app-admin-course-create',
  standalone: true,
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
  ],
  templateUrl: './admin-course-create.component.html',
  styleUrl: './admin-course-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'Trường này là bắt buộc',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxLength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        min: ({ min }: { min: string }) => of(`Giá trị tối thiểu — ${min}`),
        invalidYoutubeUrl: 'URL không đúng định dạng YouTube',
      },
    },
    {
      provide: BIDV_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
    {
      provide: BIDV_EDITOR_EXTENSIONS,
      deps: [INJECTOR],
      useFactory: (injector: Injector) => [
        ...BIDV_EDITOR_DEFAULT_EXTENSIONS,
        import('@bidv-ui/addon-editor/extensions/image-editor').then(
          ({ bidvCreateImageEditorExtension }) =>
            bidvCreateImageEditorExtension({ injector }),
        ),
      ],
    },
  ],
})
export class AdminCourseCreateComponent implements OnDestroy {
  #router = inject(Router);
  #courseService = inject(CourseService);
  #imageService = inject(ImageService);
  #mutation = injectMutation();
  #alerts = inject(BidvAlertService);
  #dialogs = inject(DialogService);

  protected isUploading = false;
  protected maxMBFileSize = 5; // MB
  protected acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  protected thumbnailSrc: string | null = null;
  protected thumbnailObjectUrl: string | null = null;

  readonly tools = Object.values(BidvEditorTool);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách khóa học',
      link: ROUTES.adminCourse,
    },
    {
      label: 'Tạo mới khóa học',
    },
  ];

  protected courseForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200),
    ]),
    description: new FormControl(''),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(15000),
    ]),
    videoUrl: new FormControl('', [Validators.required, validateYoutubeUrl]),
    thumbnail: new FormControl<BidvFileLike | null>(null, [
      Validators.required,
    ]),
  });

  // Base course creation mutation
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
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo khóa học thất bại',
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
      onError: (error) => {
        this.isUploading = false;

        this.#alerts
          .open('', {
            status: 'error',
            label: 'Tải ảnh thumbnail thất bại',
          })
          .subscribe();
      },
    });

  protected createCourseResult = this.#createCourseMutation.result;

  constructor() {
    this.trackThumbnail();
  }

  ngOnDestroy(): void {
    // Cleanup object URLs to prevent memory leaks
    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
    }
  }

  // Handlers
  private trackThumbnail() {
    this.thumbnail.valueChanges.subscribe((file) => {
      if (!file) {
        this.thumbnailSrc = null;
        if (this.thumbnailObjectUrl) {
          URL.revokeObjectURL(this.thumbnailObjectUrl);
          this.thumbnailObjectUrl = null;
        }
        return;
      }

      // Use createObjectURL for better performance
      if (this.thumbnailObjectUrl) {
        URL.revokeObjectURL(this.thumbnailObjectUrl);
      }

      this.thumbnailObjectUrl = URL.createObjectURL(file);
      this.thumbnailSrc = this.thumbnailObjectUrl;
    });
  }

  protected async handleCreateCourse() {
    // Mark all fields as touched for validation
    this.courseForm.markAllAsTouched();

    if (this.courseForm.invalid) {
      return;
    }

    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn tạo khóa học này?')
      .subscribe((status: any) => {
        if (!status) return;

        const formValue = this.courseForm.value;
        const thumbnail = formValue.thumbnail;

        const courseData: CreateCourseBody = {
          title: formValue.title as string,
          thumbnail: '', // Placeholder, will be updated after thumbnail upload
          description: formValue.description as string,
          price: Number.parseInt(formValue.price as any),
          videoUrl: formValue.videoUrl as string,
        };

        this.#createCourseWithThumbnailMutation(courseData).mutate([
          thumbnail as File,
        ]);
      });
  }

  protected handleCancel() {
    this.#router.navigate([ROUTES.adminCourse]);
  }

  // Getters
  protected get thumbnail() {
    return this.courseForm.get('thumbnail') as FormControl;
  }
}
