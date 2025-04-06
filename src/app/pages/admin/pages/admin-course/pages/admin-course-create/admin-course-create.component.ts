import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminCourseFormComponent } from '../components/admin-course-form/admin-course-form.component';

@Component({
  selector: 'app-admin-course-create',
  standalone: true,
  imports: [CommonModule, AdminCourseFormComponent],
  templateUrl: './admin-course-create.component.html',
  styleUrl: './admin-course-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseCreateComponent {}
