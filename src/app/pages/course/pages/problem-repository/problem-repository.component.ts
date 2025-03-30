import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LinkItem, SelectItem } from '@app/models';
import { bidvItemsHandlersProvider } from '@bidv-ui/kit';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { ProblemTableComponent } from '@app/pages/components/problem-table/problem-table.component';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-problem',
  imports: [CommonModule, ProblemTableComponent, BreadcrumbsComponent],
  templateUrl: './problem-repository.component.html',
  styleUrl: './problem-repository.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
  ],
})
export class ProblemRepositoryComponent {
  private activatedRoute = inject(ActivatedRoute);

  protected courseId = this.activatedRoute.snapshot.paramMap.get('id');

  protected breadcrumbs: LinkItem[] = [];

  constructor() {
    this.initBreadcrumbs();
  }

  // Init data
  private initBreadcrumbs() {
    if (this.courseId) {
      this.breadcrumbs = [
        {
          label: 'Trang chủ',
          link: ROUTES.home,
        },
        {
          label: 'Chi tiết khóa học',
          link: [ROUTES.detailCourse, this.courseId],
        },
        {
          label: 'Bài tập',
        },
      ];
    }
  }
}
