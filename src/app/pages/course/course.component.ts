import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from 'src/app/models';
import { ROUTES } from 'src/app/constants/routes';
import { ActivatedRoute } from '@angular/router';
import { CrouseMainContentComponent } from './components/course-main-content/course-main-content.component';
import { CourseSubContentComponent } from './components/course-sub-content/course-sub-content.component';
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
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Id of course
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'Detail course',
      link: ROUTES.detailCourse.replace(':id', '1'),
    },
  ];
}
