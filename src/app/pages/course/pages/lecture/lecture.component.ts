import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { DocumentItem, LinkItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { extractFileType, extractVideoId } from '@app/utils/extract-data';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { LectureListComponent } from '@app/pages/components/lecture-list/lecture-list.component';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';
import { DOC_ICONS } from '@app/constants/document';

@Component({
  selector: 'app-lecture',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    LectureListComponent,
    BidvButtonModule,
    BidvSvgModule,
  ],
  templateUrl: './lecture.component.html',
  styleUrl: './lecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private sanitizer = inject(DomSanitizer);

  private courseId = this.activatedRoute.snapshot.paramMap.get('id');

  protected breadcrumbs: LinkItem[] = [];
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
    this.initBreadcrumbs();
    this.initVideo('https://youtu.be/7_dErRbs9Xc');
    this.initDocuments();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Lecture 1'); // Replace with actual title
  }

  // Init data
  private initBreadcrumbs() {
    if (this.courseId) {
      this.breadcrumbs = [
        {
          label: 'Home',
          link: ROUTES.home,
        },
        {
          label: 'Detail course',
          link: [ROUTES.detailCourse, this.courseId],
        },
        {
          label: 'Lecture',
        },
      ];
    }
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

  protected handleSelectLecture(id: string) {
    console.log(id);
  }
}
