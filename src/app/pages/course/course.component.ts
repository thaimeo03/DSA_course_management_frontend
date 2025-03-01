import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from 'src/app/models';
import { ROUTES } from 'src/app/constants/routes';
import { ActivatedRoute } from '@angular/router';
import { CrouseMainContentComponent } from './components/course-main-content/course-main-content.component';
import { CourseSubContentComponent } from './components/course-sub-content/course-sub-content.component';
import { Title } from '@angular/platform-browser';
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
export class CourseComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'Detail course',
    },
  ];

  constructor() {
    // Id of course
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.titleService.setTitle('Course 1'); // Replace with actual title
  }
}
