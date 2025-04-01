import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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

@Component({
  selector: 'app-create-course',
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
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss',
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
      },
    },
  ],
})
export class CreateCourseComponent implements OnDestroy {
  private router = inject(Router);
  private courseService = inject(CourseService);
  private imageService = inject(ImageService);
  private mutation = injectMutation();

  protected isUploading = false;
  protected thumbnailSrc: string | null = null;
  protected thumbnailObjectUrl: string | null = null;

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách khóa học',
      link: '/admin/course',
    },
    {
      label: 'Tạo mới khóa học',
    },
  ];

  protected courseForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    videoUrl: new FormControl('', [Validators.required]),
    thumbnail: new FormControl<BidvFileLike | null>(null),
  });

  protected thumbnailControl = this.courseForm.get('thumbnail') as FormControl;

  // Create course mutation
  // protected createCourseMutation = this.mutation({
  //   mutationFn: (body: any) => this.courseService.createCourse(body),
  //   onSuccess: () => {
  //     this.router.navigate(['/admin/course']);
  //   }
  // });

  // protected createCourseResult = this.createCourseMutation.result;

  constructor() {
    this.trackThumbnail();
  }

  ngOnDestroy(): void {
    // Cleanup object URLs to prevent memory leaks
    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
    }
  }

  private trackThumbnail() {
    this.thumbnailControl.valueChanges.subscribe((file) => {
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

  protected removeThumbnail() {
    this.thumbnailControl.setValue(null);
  }

  protected async handleCreateCourse() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const formValue = this.courseForm.value;
    const thumbnail = formValue.thumbnail;

    // try {
    //   if (thumbnail) {
    //     this.isUploading = true;
    //     const formData = new FormData();
    //     formData.append('file', thumbnail);

    //     // Upload thumbnail image
    //     const response = await this.imageService.upload(formData).toPromise();

    //     if (response && response.data) {
    //       // Create course with thumbnail URL
    //       this.createCourseMutation.mutate({
    //         title: formValue.title,
    //         description: formValue.description,
    //         price: formValue.price,
    //         videoUrl: formValue.videoUrl,
    //         thumbnail: response.data.url
    //       });
    //     }

    //     this.isUploading = false;
    //   } else {
    //     // Create course without thumbnail
    //     this.createCourseMutation.mutate({
    //       title: formValue.title,
    //       description: formValue.description,
    //       price: formValue.price,
    //       videoUrl: formValue.videoUrl
    //     });
    //   }
    // } catch (error) {
    //   this.isUploading = false;
    //   console.error('Error creating course:', error);
    // }
  }
}
