import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchased-course',
  imports: [CommonModule],
  templateUrl: './purchased-course.component.html',
  styleUrl: './purchased-course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedCourseComponent {}
