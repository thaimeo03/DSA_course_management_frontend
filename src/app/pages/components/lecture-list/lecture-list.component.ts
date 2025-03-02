import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  @Input() canInteract = false;
  @Input() scrollable = false;

  @Output() selectLecture = new EventEmitter<string>();

  protected activeItemIndex = 0;
  protected lectureList = Array.from({ length: 15 });

  protected handleSelectLecture(lectureId: string, index: number) {
    this.activeItemIndex = index;
    this.selectLecture.emit(lectureId);
  }
}
