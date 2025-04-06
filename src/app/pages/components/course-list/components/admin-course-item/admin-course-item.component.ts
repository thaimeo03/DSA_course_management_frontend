import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { ActiveStatus } from '@app/enums';
import { CourseData } from '@app/models/course';
import {
  BidvAmountPipe,
  BidvCurrencyPipeModule,
} from '@bidv-ui/addon-commerce';
import { BidvButtonModule } from '@bidv-ui/core';
import {
  BidvBadgeModule,
  BidvCardModule,
  BidvLineClampModule,
} from '@bidv-ui/kit';
import { BidvCardContentModule } from '@bidv-ui/layout';

@Component({
  selector: 'app-admin-course-item',
  imports: [
    CommonModule,
    BidvCardModule,
    BidvCardContentModule,
    BidvCurrencyPipeModule,
    BidvButtonModule,
    BidvLineClampModule,
    BidvBadgeModule,
    BidvAmountPipe,
    RouterLink,
  ],
  templateUrl: './admin-course-item.component.html',
  styleUrl: './admin-course-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseItemComponent implements OnInit {
  @Input({ required: true }) course!: CourseData;

  protected detailCourseRoute = ROUTES.adminCourse;
  protected queryParams = {};

  ngOnInit(): void {
    const active = this.course.isActive
      ? ActiveStatus.Active
      : ActiveStatus.Inactive;

    this.queryParams = {
      active,
    };
  }
}
