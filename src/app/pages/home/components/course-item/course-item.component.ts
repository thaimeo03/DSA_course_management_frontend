import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvCardModule } from '@bidv-ui/kit';
import { BidvCardContentModule } from '@bidv-ui/layout';
import { BidvCurrencyPipeModule } from '@bidv-ui/addon-commerce';

@Component({
  selector: 'app-course-item',
  imports: [
    BidvCardModule,
    BidvCardContentModule,
    RouterLink,
    BidvCurrencyPipeModule,
  ],
  templateUrl: './course-item.component.html',
  styleUrl: './course-item.component.scss',
})
export class CourseItemComponent {}
