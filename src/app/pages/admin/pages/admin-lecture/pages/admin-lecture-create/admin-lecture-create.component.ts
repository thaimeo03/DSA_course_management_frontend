import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { LinkItem } from '@app/models';
import { LectureService } from '@app/services/lecture.service';
import { injectMutation } from '@bidv-api/angular';
import { AdminLectureFormComponent } from '../components/admin-lecture-form/admin-lecture-form.component';
import { BidvAlertService } from '@bidv-ui/core';

@Component({
  selector: 'app-admin-lecture-create',
  standalone: true,
  imports: [CommonModule, AdminLectureFormComponent],
  templateUrl: './admin-lecture-create.component.html',
  styleUrl: './admin-lecture-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureCreateComponent {
  private router = inject(Router);
  private lectureService = inject(LectureService);
  private alerts = inject(BidvAlertService);
  private cdr = inject(ChangeDetectorRef);
  private mutation = injectMutation();

  // Component state
  protected isSubmitting = false;

  // Breadcrumbs
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Tạo mới bài giảng',
    },
  ];

  // Mutations
  private createLectureMutation = this.mutation({
    mutationFn: (data: any) => this.lectureService.createLecture(data),
    onSuccess: () => {
      this.isSubmitting = false;
      this.alerts
        .open('', {
          status: 'success',
          label: 'Tạo mới bài giảng thành công',
        })
        .subscribe();

      this.router.navigate([ROUTES.adminLecture]);
    },
    onError: () => {
      this.isSubmitting = false;
      this.alerts
        .open('', {
          status: 'error',
          label: 'Tạo mới bài giảng thất bại',
        })
        .subscribe();
      this.cdr.markForCheck();
    },
  });

  protected handleFormSubmit(data: any): void {
    this.isSubmitting = true;
    this.createLectureMutation.mutate(data);
  }

  protected handleFormCancel(): void {
    this.router.navigate([ROUTES.adminLecture]);
  }
}
