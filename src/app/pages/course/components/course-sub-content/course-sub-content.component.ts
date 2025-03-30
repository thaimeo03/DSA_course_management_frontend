import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CourseListComponent } from '@app/pages/components/course-list/course-list.component';
import { BidvTabsModule } from '@bidv-ui/kit';
import { LectureListComponent } from '@app/pages/components/lecture-list/lecture-list.component';
import { ProblemTableComponent } from '@app/pages/components/problem-table/problem-table.component';
import { ActivatedRoute } from '@angular/router';
import { CourseType } from '@app/enums/course';

@Component({
  selector: 'app-course-sub-content',
  imports: [
    CommonModule,
    BidvTabsModule,
    CourseListComponent,
    LectureListComponent,
    ProblemTableComponent,
  ],
  templateUrl: './course-sub-content.component.html',
  styleUrl: './course-sub-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSubContentComponent {
  private activatedRoute = inject(ActivatedRoute);

  protected courseId = this.activatedRoute.snapshot.paramMap.get('id');
  protected activeItemIndex = 0;
  protected activeType = CourseType.ACTIVE;
}
