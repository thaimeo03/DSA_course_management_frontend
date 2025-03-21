import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LectureData } from '@app/models/lecture';
import { BidvSvgModule } from '@bidv-ui/core';

@Component({
  selector: 'app-lecture-item',
  imports: [CommonModule, BidvSvgModule],
  templateUrl: './lecture-item.component.html',
  styleUrl: './lecture-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureItemComponent {
  @Input({ required: true }) lectureData!: LectureData;
}
