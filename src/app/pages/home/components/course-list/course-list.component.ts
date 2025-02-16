import { Component } from '@angular/core';
import { CourseItemComponent } from '../course-item/course-item.component';
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

  protected pageCount = 10;
  protected currentPage = 0;

  protected goToPage(page: number) {
    console.log(page);
  }
}
