import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BidvBadgeModule,
  BidvCardModule,
  BidvLineClampModule,
} from '@bidv-ui/kit';
import { BidvCardContentModule } from '@bidv-ui/layout';
import {
  BidvAmountPipe,
  BidvCurrencyPipeModule,
} from '@bidv-ui/addon-commerce';
import { BidvButtonModule } from '@bidv-ui/core';
import { CommonModule } from '@angular/common';
import { CourseData } from '@app/models/course';
import { ROUTES } from '@app/constants/routes';

@Component({
  selector: 'app-course-item',
  imports: [
    CommonModule,
    BidvCardModule,
    BidvCardContentModule,
    RouterLink,
    BidvCurrencyPipeModule,
    BidvButtonModule,
    BidvLineClampModule,
    BidvBadgeModule,
    BidvAmountPipe,
  ],
  templateUrl: './course-item.component.html',
  styleUrl: './course-item.component.scss',
})
export class CourseItemComponent {
  @Input({ required: true }) course!: CourseData;
  @Input() isPurchased: boolean = false;

  protected detailCourseRoute = ROUTES.detailCourse;
}
