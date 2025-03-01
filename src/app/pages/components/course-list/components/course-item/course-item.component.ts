import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvCardModule, BidvLineClampModule } from '@bidv-ui/kit';
import { BidvCardContentModule } from '@bidv-ui/layout';
import { BidvCurrencyPipeModule } from '@bidv-ui/addon-commerce';
import { BidvButtonModule } from '@bidv-ui/core';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './course-item.component.html',
  styleUrl: './course-item.component.scss',
})
export class CourseItemComponent {
  @Input() purchasedIndex: number[] = [];
  @Input() index: number = 0;
}
