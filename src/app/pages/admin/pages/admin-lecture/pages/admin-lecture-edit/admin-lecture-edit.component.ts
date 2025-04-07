import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { LectureData } from '@app/models/lecture';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { LectureService } from '@app/services/lecture.service';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminLectureFormComponent } from '../components/admin-lecture-form/admin-lecture-form.component';
import { BidvAlertService } from '@bidv-ui/core';

@Component({
  selector: 'app-admin-lecture-edit',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, AdminLectureFormComponent],
  templateUrl: './admin-lecture-edit.component.html',
  styleUrl: './admin-lecture-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureEditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private lectureService = inject(LectureService);
  private alerts = inject(BidvAlertService);
  private cdr = inject(ChangeDetectorRef);
  private query = injectQuery();
  private mutation = injectMutation();

  // Component state
  protected isLoading = true;
  protected isSubmitting = false;
  protected lecture: LectureData | null = null;
  protected lectureId: string = '';

  // Breadcrumbs
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Chỉnh sửa bài giảng',
    },
  ];

  // Queries
  // private getLectureQuery = this.query({
  //   queryKey: ['admin-lecture-detail', this.lectureId],
  //   queryFn: () => this.lectureService.getLectureById(this.lectureId),
  //   enabled: false,
  // });

  // Mutations
  private updateLectureMutation = this.mutation({
    mutationFn: (data: any) =>
      this.lectureService.updateLecture(this.lectureId, data),
    onSuccess: () => {
      this.isSubmitting = false;
      this.alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật bài giảng thành công',
        })
        .subscribe();

      this.router.navigate([ROUTES.adminLecture]);
    },
    onError: () => {
      this.isSubmitting = false;
      this.alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật bài giảng thất bại',
        })
        .subscribe();
      this.cdr.markForCheck();
    },
  });

  ngOnInit(): void {
    this.lectureId = this.route.snapshot.params['id'];
    this.breadcrumbs[1].label = 'Chỉnh sửa bài giảng';

    // if (this.lectureId) {
    //   this.getLectureQuery.updateOptions({
    //     queryKey: ['admin-lecture-detail', this.lectureId],
    //     enabled: true,
    //   });

    //   this.getLectureQuery.result$
    //     .pipe(takeUntilDestroyed())
    //     .subscribe((result) => {
    //       this.isLoading = false;
    //       if (result.data) {
    //         this.lecture = result.data;
    //         this.cdr.markForCheck();
    //       }
    //     });
    // }
  }

  protected handleFormSubmit(data: any): void {
    this.isSubmitting = true;
    this.updateLectureMutation.mutate(data);
  }

  protected handleFormCancel(): void {
    this.router.navigate([ROUTES.adminLecture]);
  }
}
