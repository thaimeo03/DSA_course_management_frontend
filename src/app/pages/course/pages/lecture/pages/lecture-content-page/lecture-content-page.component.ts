import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { DocumentItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { extractFileType, extractVideoId } from '@app/utils/extract-data';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';
import { DOC_ICONS } from '@app/constants/document';
import { LectureData, LectureQueryParams } from '@app/models/lecture';
import { Store } from '@ngrx/store';
import { selectLectureData } from 'stores/selectors/lecture.selector';

@Component({
  selector: 'app-lecture-content-page',
  imports: [CommonModule, BidvButtonModule, BidvSvgModule],
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

  // Data
  protected courseId = this.activatedRoute.snapshot.paramMap.get('id');
  protected lectureData: LectureData | null = null;
  protected quantity = 0;
  protected videoUrl!: SafeResourceUrl;

  protected documents: DocumentItem[] = [
    {
      label: 'Tài liệu 1',
      link: 'https://www.youtube.com/watch?v=9EqRXHVQvLA',
    },
    {
      label: 'Tài liệu 2',
      link: 'https://res.cloudinary.com/dnhs6xylt/raw/upload/v1740849541/DecuongDATN_211203622_TranHongThai_CNTT3_K62_qfqit2.docx',
    },
    {
      label: 'Tài liệu 3',
      link: 'https://res.cloudinary.com/dnhs6xylt/image/upload/v1740849848/Ke-hoach-thuc-hien-%C4%90ATN-K62-tro-ve-truoc-Dot-1_wc7hd7.pdf',
    },
  ];

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
    this.documents = this.documents.map((document) => ({
      ...document,
      iconSrc: DOC_ICONS[extractFileType(document.link)],
    }));
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
