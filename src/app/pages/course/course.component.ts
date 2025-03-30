import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from 'src/app/models';
import { ROUTES } from 'src/app/constants/routes';
import { CrouseMainContentComponent } from './components/course-main-content/course-main-content.component';
import { CourseSubContentComponent } from './components/course-sub-content/course-sub-content.component';
import { Title } from '@angular/platform-browser';
import { DetailCourseData } from '@app/models/course';
@Component({
  selector: 'app-course',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    CrouseMainContentComponent,
    CourseSubContentComponent,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent {
  private titleService = inject(Title);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Trang chủ',
      link: ROUTES.home,
    },
    {
      label: 'Chi tiết khóa học',
    },
  ];

  // Handlers
  protected handleDetailCourse(detailCourse: DetailCourseData) {
    this.titleService.setTitle(detailCourse.title);
  }
}
