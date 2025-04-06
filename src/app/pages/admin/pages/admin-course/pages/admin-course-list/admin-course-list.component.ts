import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CourseType } from '@app/enums/course';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseListComponent } from '@app/pages/components/course-list/course-list.component';
import { BidvButtonModule } from '@bidv-ui/core';

@Component({
  selector: 'admin-admin-course-list',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    CourseListComponent,
    BidvButtonModule,
    RouterModule,
  ],
  templateUrl: './admin-course-list.component.html',
  styleUrl: './admin-course-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách khóa học',
    },
  ];

  protected activeType = CourseType.ALL;
  protected isCreateRoute = false;

  protected navigateToCreateCourse() {
    this.router.navigate([ROUTES.adminCreateCourse], {
      relativeTo: this.route,
    });
  }
}
