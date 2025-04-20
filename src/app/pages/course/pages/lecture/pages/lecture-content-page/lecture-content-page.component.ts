import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ROUTES } from '@app/constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { extractVideoId } from '@app/utils/extract-data';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';
import { LectureData, LectureQueryParams } from '@app/models/lecture';
import { Store } from '@ngrx/store';
import { selectLectureData } from 'stores/selectors/lecture.selector';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import { DocumentService } from '@app/services/document.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DocumentData } from '@app/models/document';
import { DocumentViewerComponent } from '../../../../../components/document-viewer/document-viewer.component';

@Component({
  selector: 'app-lecture-content-page',
  imports: [
    CommonModule,
    BidvButtonModule,
    BidvSvgModule,
    DocumentViewerComponent,
  ],
  templateUrl: './lecture-content-page.component.html',
  styleUrl: './lecture-content-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureContentPageComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private sanitizer = inject(DomSanitizer);
  #cdr = inject(ChangeDetectorRef);
  #store = inject(Store);
  #query = injectQuery();
  #documentService = inject(DocumentService);
  #destroyRef = inject(DestroyRef);

  // Data
  protected courseId = this.activatedRoute.snapshot.paramMap.get('id');
  protected lectureData: LectureData | null = null;
  protected quantity = 0;
  protected videoUrl!: SafeResourceUrl;
  protected documentData: DocumentData[] = [];

  // Query options
  private getDocumentsOptions(lectureId?: string) {
    return queryOptions({
      enabled: !!lectureId,
      queryKey: ['lecture-documents', lectureId],
      queryFn: () => {
        if (!lectureId) return;
        return this.#documentService.getDocumentsByLessonId(lectureId);
      },
      refetchOnWindowFocus: false,
    });
  }

  // Queries
  #getDocumentsQuery = this.#query(this.getDocumentsOptions());

  constructor() {
    this.initData();
    this.initDocuments();
  }

  // Init data
  private initData() {
    this.#store.select(selectLectureData).subscribe((lectureState) => {
      this.lectureData = lectureState.lectureData;
      this.quantity = lectureState.quantity;
      if (!this.lectureData) return;

      this.titleService.setTitle(this.lectureData.title);
      this.initVideo(this.lectureData.videoUrl);
      this.#getDocumentsQuery.updateOptions(
        this.getDocumentsOptions(this.lectureData.id),
      );

      this.#cdr.markForCheck();
    });
  }

  private initVideo(url: string) {
    const videoId = extractVideoId(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  private initDocuments() {
    this.#getDocumentsQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.documentData = data.data;

        this.#cdr.markForCheck();
      });
  }

  // Handlers
  protected handleNavigateProblem() {
    this.router.navigate([
      ROUTES.detailCourse,
      this.courseId,
      ROUTES.problemRepository,
    ]);
  }

  protected handleNavigateNextLecture() {
    if (!this.lectureData) return;

    if (!this.isLastLecture) {
      const queryParams: LectureQueryParams = {
        no: this.lectureData.no + 1,
      };

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    }
  }

  // Getters
  protected get isLastLecture() {
    return this.lectureData?.no === this.quantity;
  }
}
