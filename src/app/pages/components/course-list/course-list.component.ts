import { Component } from '@angular/core';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { CommonModule } from '@angular/common';
import { BidvPaginationModule } from '@bidv-ui/kit';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseItemComponent, BidvPaginationModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent {
  protected courseList = Array.from({ length: 12 });
  protected purchasedIndex = [0, 3, 4];
}
