import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { BidvAlertService, BidvButtonModule } from '@bidv-ui/core';
import {
  BidvBadgeModule,
  BidvSkeletonDirective,
  BidvTabsModule,
} from '@bidv-ui/kit';
import { ROUTES } from '@app/constants/routes';
import { LectureService } from '@app/services/lecture.service';
import { LectureData } from '@app/models/lecture';
import { ErrorResponse, LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { extractVideoId } from '@app/utils/extract-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BadgeItem } from '@app/models';
import { DialogService } from '@app/services/share/dialog.service';
import { AdminLectureDocumentComponent } from './components/admin-lecture-document/admin-lecture-document.component';

@Component({
  selector: 'app-admin-lecture-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvSkeletonDirective,
    BidvBadgeModule,
    BidvTabsModule,
    AdminLectureDocumentComponent,
  ],
  templateUrl: './admin-lecture-detail.component.html',
  styleUrl: './admin-lecture-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureDetailComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #lectureService = inject(LectureService);
  #sanitizer = inject(DomSanitizer);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  #query = injectQuery();
  #mutation = injectMutation();
  #dialogs = inject(DialogService);
  #alerts = inject(BidvAlertService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Chi tiết bài giảng',
    },
  ];

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

  protected activeTabIndex = 0;

  // Data
  protected lectureId = this.#activatedRoute.snapshot.params['id'];
  protected lectureData: LectureData | null = null;
  protected isActive!: boolean;
  protected videoUrl: SafeResourceUrl | null = null;

  // Queries
  #lectureQuery = this.#query({
    queryKey: ['lecture-detail'],
    queryFn: () => this.#lectureService.getLectureDetail(this.lectureId),
    refetchOnWindowFocus: false,
  });

  // Mutations
  #deleteLectureMutation = this.#mutation({
    mutationFn: () => {
      return this.#lectureService.deleteLecture(this.lectureId);
    },
    onSuccess: () => {
      // Redirect to lecture list
      this.#router.navigate([ROUTES.adminLecture]);

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa bài giảng thành công',
        })
        .subscribe();
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

  #activeCourseMutation = this.#mutation({
    mutationFn: () => {
      return this.#lectureService.activeLecture(this.lectureId);
    },
    onSuccess: () => {
      this.isActive = true;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Kích hoạt bài giảng thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
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

  #inactiveLectureMutation = this.#mutation({
    mutationFn: () => {
      return this.#lectureService.inactiveLecture(this.lectureId);
    },
    onSuccess: () => {
      this.isActive = false;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Hủy kích hoạt bài giảng thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
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

  #archiveLectureMutation = this.#mutation({
    mutationFn: () => {
      return this.#lectureService.archiveLecture(this.lectureId);
    },
    onSuccess: () => {
      // Redirect to lecture list
      this.#router.navigate([ROUTES.adminLecture]);

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Lưu trữ bài giảng thành công',
        })
        .subscribe();
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

  // Lifecycle
  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.#lectureQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        this.lectureData = res.data.data;
        this.isActive = this.lectureData.isActive;
        this.videoUrl = this.initVideo(this.lectureData.videoUrl);

        this.#cdr.markForCheck();
      });
  }

  private initVideo(url: string): SafeResourceUrl {
    const videoId = extractVideoId(url);
    return this.#sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  // Handlers
  protected navigateToEdit(): void {
    this.#router.navigate([ROUTES.adminLecture, this.lectureId, 'edit']);
  }

  protected navigateToList(): void {
    this.#router.navigate([ROUTES.adminLecture]);
  }

  protected handleActivateLecture() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn kích hoạt bài giảng này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#activeCourseMutation.mutate(null);
      });
  }

  protected handleDeactivateLecture() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn hủy kích hoạt bài giảng này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#inactiveLectureMutation.mutate(null);
      });
  }

  protected handleDeleteLecture() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa bài giảng này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#deleteLectureMutation.mutate(null);
      });
  }

  protected handleArchiveLecture() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn lưu trữ bài giảng này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#archiveLectureMutation.mutate(null);
      });
  }

  protected get badgeItem(): BadgeItem {
    return this.isActive
      ? this.badgeItems['active']
      : this.badgeItems['inactive'];
  }
}
