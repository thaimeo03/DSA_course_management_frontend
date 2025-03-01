import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LectureItemComponent } from './components/lecture-item/lecture-item.component';

@Component({
  selector: 'app-lecture-list',
  imports: [CommonModule, LectureItemComponent],
  templateUrl: './lecture-list.component.html',
  styleUrl: './lecture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureListComponent {
  @Input() clickable = false;

  protected lectureList = Array.from({ length: 10 });
}
