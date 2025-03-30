import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LectureListComponent } from '@app/pages/components/lecture-list/lecture-list.component';
import { LectureData } from '@app/models/lecture';

@Component({
  selector: 'app-lecture',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    RouterOutlet,
    LectureListComponent,
  ],
  templateUrl: './lecture.component.html',
  styleUrl: './lecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureComponent {
  private activatedRoute = inject(ActivatedRoute);

  // Data
  protected courseId = this.activatedRoute.snapshot.paramMap.get('id');
  protected lectureData: LectureData | null = null;

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Trang chủ',
      link: ROUTES.home,
    },
    {
      label: 'Chi tiết khóa học',
      link: [ROUTES.detailCourse, this.courseId],
    },
    {
      label: 'Bài giảng',
    },
  ];

  constructor() {
    this.initBreadcrumbs();
  }

  // Init data
  private initBreadcrumbs() {
    if (this.courseId) {
      this.breadcrumbs = [
        {
          label: 'Trang chủ',
          link: ROUTES.home,
        },
        {
          label: 'Chi tiết khóa học',
          link: [ROUTES.detailCourse, this.courseId],
        },
        {
          label: 'Bài giảng',
        },
      ];
    }
  }

  protected handleSelectLecture(lectureData: LectureData) {
    this.lectureData = lectureData;
  }
}
