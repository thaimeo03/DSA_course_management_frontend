import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { LectureItemComponent } from './components/lecture-item/lecture-item.component';
import { BidvScrollbarComponent } from '@bidv-ui/core';
import { GetActiveLecturesResponse, LectureData } from '@app/models/lecture';
import { LectureService } from '@app/services/lecture.service';
import { injectQuery, QueryObserverResult } from '@bidv-api/angular';
import { Result } from 'node_modules/@bidv-api/angular/build/lib/types';

@Component({
  selector: 'app-lecture-list',
  imports: [CommonModule, LectureItemComponent, BidvScrollbarComponent],
  templateUrl: './lecture-list.component.html',
  styleUrl: './lecture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureListComponent implements OnInit {
  #cdr = inject(ChangeDetectorRef);
  #lectureService = inject(LectureService);
  #query = injectQuery();

  @Input({ required: true }) courseId!: string;
  @Input() isActive = true;
  @Input() canInteract = false;
  @Input() scrollable = false;

  @Output() selectLectureEvent = new EventEmitter<LectureData>();

  // Data
  protected lectureList: LectureData[] = [];
  protected activeItemIndex = 0;

  // Query
  #getLecturesQuery!: Result<
    QueryObserverResult<GetActiveLecturesResponse, Error>
  >;

  ngOnInit(): void {
    this.initData();
  }

  // Init Data
  private initData() {
    if (this.isActive) {
      this.#getLecturesQuery = this.#query({
        queryKey: ['active-lectures', this.courseId],
        queryFn: () => this.#lectureService.getAllActiveLectures(this.courseId),
        refetchOnWindowFocus: false,
      });

      this.#getLecturesQuery.result$.subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.lectureList = data.data;
        this.#cdr.markForCheck();
      });
    }
  }

  // Handlers
  protected handleSelectLecture(lectureData: LectureData, index: number) {
    this.activeItemIndex = index;
    this.selectLectureEvent.emit(lectureData);
  }
}
