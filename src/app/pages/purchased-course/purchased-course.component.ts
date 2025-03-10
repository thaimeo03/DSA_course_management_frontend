import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourseListComponent } from '../components/course-list/course-list.component';

@Component({
  selector: 'app-purchased-course',
  imports: [CommonModule, CourseListComponent],
  templateUrl: './purchased-course.component.html',
  styleUrl: './purchased-course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedCourseComponent {}
