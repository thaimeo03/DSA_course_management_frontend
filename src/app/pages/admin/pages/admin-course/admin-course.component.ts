import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  Router,
  RouterModule,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { CourseType } from '@app/enums/course';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CourseListComponent } from '@app/pages/components/course-list/course-list.component';
import { BidvButtonModule } from '@bidv-ui/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-course',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    CourseListComponent,
    BidvButtonModule,
    RouterModule,
  ],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách khóa học',
    },
  ];

  protected activeType = CourseType.ALL;
  protected isCreateRoute = false;

  ngOnInit() {
    // Subscribe to router events to detect when the route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });

    // Initial check for current route
    this.checkRoute();
  }

  private checkRoute() {
    // Check if the current route is the create route
    this.isCreateRoute = this.router.url.includes('/admin/course/create');
  }

  protected navigateToCreateCourse() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
}
