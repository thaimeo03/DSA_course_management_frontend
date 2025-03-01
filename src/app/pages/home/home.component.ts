import { Component } from '@angular/core';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { SortingComponent } from './components/sorting/sorting.component';
import { LinkItem } from 'src/app/models';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { ROUTES } from 'src/app/constants/routes';
import { BidvPaginationModule } from '@bidv-ui/kit';

@Component({
  selector: 'app-home',
  imports: [
    CourseListComponent,
    SortingComponent,
    BreadcrumbsComponent,
    BidvPaginationModule,
  ],
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

  protected pageCount = 10;
  protected currentPage = 0;

  protected goToPage(page: number) {
    console.log(page);
  }
}
