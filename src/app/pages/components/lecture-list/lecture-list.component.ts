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
import {
  GetActiveLecturesResponse,
  LectureData,
  LectureQueryParams,
} from '@app/models/lecture';
import { LectureService } from '@app/services/lecture.service';
import { injectQuery, QueryObserverResult } from '@bidv-api/angular';
import { Result } from 'node_modules/@bidv-api/angular/build/lib/types';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setLectureData } from 'stores/actions/lecture.action';

@Component({
  selector: 'app-lecture-list',
  imports: [CommonModule, LectureItemComponent, BidvScrollbarComponent],
  templateUrl: './lecture-list.component.html',
  styleUrl: './lecture-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureListComponent implements OnInit {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #cdr = inject(ChangeDetectorRef);
  #lectureService = inject(LectureService);
  #query = injectQuery();
  #store = inject(Store);

  @Input({ required: true }) courseId!: string;
  @Input() isActive = true;
  @Input() canInteract = false;
  @Input() scrollable = false;

  @Output() selectLectureEvent = new EventEmitter<LectureData>();

  // Data
  protected lectureList: LectureData[] | null = null;
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
    if (this.canInteract) {
      this.#activatedRoute.queryParams.subscribe((params) => {
        const lectureNo = (params as LectureQueryParams).no;
        const temp = Number(lectureNo);

        if (!lectureNo || Number.isNaN(temp)) {
          return;
        }

        this.activeItemIndex = temp - 1;

        if (this.lectureList === null) {
          this.handleGetLectures();
        }

        if (this.lectureList && this.canInteract) {
          const lectureData = this.lectureList[this.activeItemIndex];
          this.shareLectureData(lectureData);
        }
      });
    } else {
      this.handleGetLectures();
    }
  }

  // Handlers
  private handleGetLectures() {
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

        if (this.activeItemIndex < this.lectureList.length) {
          const lectureData = this.lectureList[this.activeItemIndex];
          this.shareLectureData(lectureData);
        }

        this.#store.dispatch(
          setLectureData({ quantity: this.lectureList.length }),
        );

        this.#cdr.markForCheck();
      });
    }
  }

  protected handleSelectLecture(index: number) {
    // Navigate to update new no
    const queryParams: LectureQueryParams = {
      no: index + 1,
    };
    this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected shareLectureData(lectureData: LectureData) {
    this.selectLectureEvent.emit(lectureData);
    this.#store.dispatch(setLectureData({ lectureData }));
  }
}
