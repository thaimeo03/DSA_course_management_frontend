import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-lecture',
  imports: [CommonModule],
  templateUrl: './admin-lecture.component.html',
  styleUrl: './admin-lecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureComponent {}
