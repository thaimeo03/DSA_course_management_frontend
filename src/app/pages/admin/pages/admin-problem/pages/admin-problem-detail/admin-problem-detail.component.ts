import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { BidvAlertService, BidvButtonModule } from '@bidv-ui/core';
import { BidvBadgeModule, BidvTabsModule } from '@bidv-ui/kit';
import { ROUTES } from '@app/constants/routes';
import { ProblemService } from '@app/services/problem.service';
import { ProblemRepositoryData } from '@app/models/problem';
import { LinkItem } from '@app/models';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BadgeItem } from '@app/models';
import { DialogService } from '@app/services/share/dialog.service';
import { Difficulty } from '@app/enums/problem';
import { AdminProblemTemplateComponent } from './components/admin-problem-template/admin-problem-template.component';

@Component({
  selector: 'app-admin-problem-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    BidvButtonModule,
    BidvBadgeModule,
    BidvTabsModule,
    AdminProblemTemplateComponent,
  ],
  templateUrl: './admin-problem-detail.component.html',
  styleUrl: './admin-problem-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemDetailComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #problemService = inject(ProblemService);
  #sanitizer = inject(DomSanitizer);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  #query = injectQuery();
  #mutation = injectMutation();
  #dialogs = inject(DialogService);
  #alerts = inject(BidvAlertService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách bài tập',
      link: ROUTES.adminProblem,
    },
    {
      label: 'Chi tiết bài tập',
    },
  ];

  protected badgeItems: { [key: string]: BadgeItem } = {
    active: {
      label: 'Đã kích hoạt',
      value: '',
      class: 'badge-green',
    },
    inactive: {
      label: 'Chưa kích hoạt',
      value: '',
      class: 'badge-red',
    },
  };

  protected difficultyBadges: Record<Difficulty, BadgeItem> = {
    [Difficulty.Easy]: {
      label: 'Dễ',
      value: '',
      class: 'badge-green',
    },
    [Difficulty.Medium]: {
      label: 'Trung bình',
      value: '',
      class: 'badge-yellow',
    },
    [Difficulty.Hard]: {
      label: 'Khó',
      value: '',
      class: 'badge-red',
    },
  };

  // Data
  protected problemId = this.#activatedRoute.snapshot.params['id'];
  protected problemData: ProblemRepositoryData | null = null;
  protected isActive!: boolean;

  // Queries
  #problemQuery = this.#query({
    queryKey: ['problem-detail'],
    queryFn: () => this.#problemService.getProblemDetail(this.problemId),
    refetchOnWindowFocus: false,
  });

  // Mutations
  #deleteProblemMutation = this.#mutation({
    mutationFn: () => {
      return this.#problemService.deleteProblem(this.problemId);
    },
    onSuccess: () => {
      // Redirect to problem list
      this.#router.navigate([ROUTES.adminProblem]);

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa bài tập thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Xóa bài tập thất bại',
        })
        .subscribe();
    },
  });

  #activeProblemMutation = this.#mutation({
    mutationFn: () => {
      return this.#problemService.activeProblem(this.problemId);
    },
    onSuccess: () => {
      this.isActive = true;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Kích hoạt bài tập thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Kích hoạt bài tập thất bại',
        })
        .subscribe();
    },
  });

  #inactiveProblemMutation = this.#mutation({
    mutationFn: () => {
      return this.#problemService.inactiveProblem(this.problemId);
    },
    onSuccess: () => {
      this.isActive = false;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Hủy kích hoạt bài tập thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Hủy kích hoạt bài tập thất bại',
        })
        .subscribe();
    },
  });

  #archiveProblemMutation = this.#mutation({
    mutationFn: () => {
      return this.#problemService.archiveProblem(this.problemId);
    },
    onSuccess: () => {
      // Redirect to problem list
      this.#router.navigate([ROUTES.adminProblem]);

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Lưu trữ bài tập thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Lưu trữ bài tập thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.#problemQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        this.problemData = res.data.data;
        this.isActive = this.problemData.isActive;

        this.#cdr.markForCheck();
      });
  }

  // Handlers
  protected navigateToEdit(): void {
    this.#router.navigate([ROUTES.adminProblem, this.problemId, 'edit']);
  }

  protected navigateToList(): void {
    this.#router.navigate([ROUTES.adminProblem]);
  }

  protected handleActivateProblem() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn kích hoạt bài tập này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#activeProblemMutation.mutate(null);
      });
  }

  protected handleDeactivateProblem() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn hủy kích hoạt bài tập này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#inactiveProblemMutation.mutate(null);
      });
  }

  protected handleDeleteProblem() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa bài tập này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#deleteProblemMutation.mutate(null);
      });
  }

  protected handleArchiveProblem() {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn lưu trữ bài tập này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#archiveProblemMutation.mutate(null);
      });
  }

  protected get badgeItem(): BadgeItem {
    return this.isActive
      ? this.badgeItems['active']
      : this.badgeItems['inactive'];
  }

  protected get difficultyBadge(): BadgeItem {
    return this.problemData
      ? this.difficultyBadges[this.problemData.difficulty]
      : this.difficultyBadges[Difficulty.Medium]; // Default to Medium
  }

  protected get sanitizedDescription(): SafeHtml | null {
    if (!this.problemData?.content) return null;
    return this.#sanitizer.bypassSecurityTrustHtml(this.problemData.content);
  }

  protected activeTabIndex = 0;
}
