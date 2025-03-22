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

  protected breadcrumbs: LinkItem[] = [];

  constructor() {
    this.initBreadcrumbs();
  }

  // Init data
  private initBreadcrumbs() {
    if (this.courseId) {
      this.breadcrumbs = [
        {
          label: 'Home',
          link: ROUTES.home,
        },
        {
          label: 'Detail course',
          link: [ROUTES.detailCourse, this.courseId],
        },
        {
          label: 'Lecture',
        },
      ];
    }
  }

  protected handleSelectLecture(lectureData: LectureData) {
    this.lectureData = lectureData;
  }
}
