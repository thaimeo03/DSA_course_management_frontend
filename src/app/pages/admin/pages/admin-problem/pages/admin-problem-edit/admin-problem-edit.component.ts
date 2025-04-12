import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '@app/services/problem.service';
import { injectQuery } from '@bidv-api/angular';
import { AdminProblemFormComponent } from '../components/admin-problem-form/admin-problem-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProblemRepositoryData } from '@app/models/problem';

@Component({
  selector: 'app-admin-problem-edit',
  standalone: true,
  imports: [CommonModule, AdminProblemFormComponent],
  template: `<app-admin-problem-form
    *ngIf="problemData"
    [problemData]="problemData"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemEditComponent {
  #activatedRoute = inject(ActivatedRoute);
  #problemService = inject(ProblemService);
  #destroyRef = inject(DestroyRef);
  #query = injectQuery();
  #cdr = inject(ChangeDetectorRef);

  // Data
  protected problemId = this.#activatedRoute.snapshot.params['id'];
  protected problemData: ProblemRepositoryData | null = null;

  // Queries
  #problemQuery = this.#query({
    queryKey: ['problem-detail-edit'],
    queryFn: () => this.#problemService.getProblemDetail(this.problemId),
    refetchOnWindowFocus: false,
  });

  constructor() {
    this.#problemQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        this.problemData = res.data.data;
        this.#cdr.markForCheck();
      });
  }
}
