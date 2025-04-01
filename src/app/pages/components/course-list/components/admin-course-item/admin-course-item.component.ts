import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  ],
  templateUrl: './admin-course-item.component.html',
  styleUrl: './admin-course-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseItemComponent {
  @Input({ required: true }) course!: CourseData;
}
