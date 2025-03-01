import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LectureItemComponent } from './components/lecture-item/lecture-item.component';
import { BidvScrollbarComponent } from '@bidv-ui/core';

@Component({
  selector: 'app-lecture-list',
  imports: [CommonModule, LectureItemComponent, BidvScrollbarComponent],
  templateUrl: './lecture-list.component.html',
  styleUrl: './lecture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureListComponent {
  @Input() clickable = false;
  @Input() scrollable = false;

  protected lectureList = Array.from({ length: 15 });
}
