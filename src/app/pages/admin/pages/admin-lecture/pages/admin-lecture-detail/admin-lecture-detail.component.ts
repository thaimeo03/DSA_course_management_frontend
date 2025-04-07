import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { injectQuery } from '@bidv-api/angular';
import { BidvAlertService, BidvButtonModule } from '@bidv-ui/core';
import { BidvDividerDirective } from '@bidv-ui/kit';
import { ROUTES } from '@app/constants/routes';
import { LectureService } from '@app/services/lecture.service';
import { LectureData } from '@app/models/lecture';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { extractVideoId } from '@app/utils/extract-data';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-admin-lecture-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvDividerDirective,
    DatePipe,
  ],
  templateUrl: './admin-lecture-detail.component.html',
  styleUrl: './admin-lecture-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureDetailComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #lectureService = inject(LectureService);
  #alerts = inject(BidvAlertService);
  #query = injectQuery();
  #sanitizer = inject(DomSanitizer);

  protected lectureId = '';
  protected lecture: LectureData | null = null;
  protected safeVideoUrl: SafeResourceUrl | null = null;

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Chi tiết bài giảng',
    },
  ];

  protected lectureQuery = this.#query({
    queryKey: ['lecture-detail'],
    enabled: false,
    queryFn: () => {
      return this.#lectureService.getLecture(this.lectureId).pipe(
        tap((response) => {
          this.lecture = response.data;

          if (this.lecture && this.lecture.videoUrl) {
            this.safeVideoUrl = this.getSafeVideoUrl(this.lecture.videoUrl);
          }
        }),
        catchError((error) => {
          this.#alerts
            .open('', {
              status: 'error',
              label: 'Không tìm thấy bài giảng',
            })
            .subscribe();

          this.#router.navigate([ROUTES.adminLecture]);
          return EMPTY;
        }),
      );
    },
  });

  ngOnInit(): void {
    this.#route.params.subscribe((params) => {
      this.lectureId = params['id'];
    });
  }

  protected navigateToEdit(): void {
    this.#router.navigate([ROUTES.adminLecture, this.lectureId, 'edit']);
  }

  protected navigateToList(): void {
    this.#router.navigate([ROUTES.adminLecture]);
  }

  private getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = extractVideoId(url);
    return this.#sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }
}
