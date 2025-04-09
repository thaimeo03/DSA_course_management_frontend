import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { LectureData } from '@app/models/lecture';
import { LinkItem } from '@app/models';
import { LectureService } from '@app/services/lecture.service';
import { injectQuery, queryOptions } from '@bidv-api/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminLectureFormComponent } from '../components/admin-lecture-form/admin-lecture-form.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-lecture-edit',
  standalone: true,
  imports: [CommonModule, AdminLectureFormComponent],
  templateUrl: './admin-lecture-edit.component.html',
  styleUrl: './admin-lecture-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLectureEditComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #titleService = inject(Title);
  #lectureService = inject(LectureService);
  #query = injectQuery();
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);

  // Data
  protected lectureId = this.#activatedRoute.snapshot.params['id'];
  protected lectureData: LectureData | null = null;

  // Breadcrumbs
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài giảng',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Chỉnh sửa bài giảng',
    },
  ];

  // Query Options
  protected getLectureDetailOptions = () =>
    queryOptions({
      enabled: !!this.lectureId,
      queryKey: ['admin-lecture-detail', this.lectureId],
      queryFn: () => this.#lectureService.getLectureDetail(this.lectureId),
      refetchOnWindowFocus: false,
    });

  // Queries
  #getLectureDetailQuery = this.#query(this.getLectureDetailOptions());

  ngOnInit(): void {
    this.initData();
  }

  // Init data
  private initData() {
    this.#getLectureDetailQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        const data = res.data;
        if (!data) return;

        this.lectureData = data.data;

        this.#titleService.setTitle(this.lectureData.title);

        this.#cdr.markForCheck();
      });
  }
}
