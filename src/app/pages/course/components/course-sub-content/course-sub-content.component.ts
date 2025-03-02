import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourseListComponent } from '@app/pages/components/course-list/course-list.component';
import { BidvTabsModule } from '@bidv-ui/kit';
import { LectureListComponent } from '@app/pages/components/lecture-list/lecture-list.component';
import { ProblemTableComponent } from '@app/pages/components/problem-table/problem-table.component';

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
  protected activeItemIndex = 0;
}
