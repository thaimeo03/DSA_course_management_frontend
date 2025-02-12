import { Component } from '@angular/core';
import { CourseItemComponent } from '../course-item/course-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseItemComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent {
  protected courseList = Array.from({ length: 7 });
}
