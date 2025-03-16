import { Component, inject, Input, OnInit } from '@angular/core';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { CommonModule } from '@angular/common';
import { BidvPaginationModule } from '@bidv-ui/kit';
import { CourseService } from '@app/services/course.service';
import { CourseData } from '@app/models/course';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseItemComponent, BidvPaginationModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  #courseService = inject(CourseService);

  @Input() isActive: boolean = true;

  protected courseList: CourseData[] = [];

  // protected courseList = Array.from({ length: 12 });
  // protected purchasedIndex = [0, 3, 4];

  ngOnInit(): void {
    if (this.isActive) {
      this.#courseService.getAllActiveCourses().subscribe((res) => {
        this.courseList = res.data;
      });
    }
  }
}
