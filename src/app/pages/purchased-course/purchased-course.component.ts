import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { CourseType } from '@app/enums/course';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';

@Component({
  selector: 'app-purchased-course',
  imports: [CommonModule, CourseListComponent, BreadcrumbsComponent],
  templateUrl: './purchased-course.component.html',
  styleUrl: './purchased-course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedCourseComponent {
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Khóa học đã mua',
      link: ROUTES.purchasedCourse,
    },
  ];

  protected activeType = CourseType.PURCHASED;
}
