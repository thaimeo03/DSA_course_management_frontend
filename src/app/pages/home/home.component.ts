import { Component } from '@angular/core';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { LinkItem } from 'src/app/models';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { ROUTES } from 'src/app/constants/routes';

@Component({
  selector: 'app-home',
  imports: [CourseListComponent, BreadcrumbsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
  ];
}
