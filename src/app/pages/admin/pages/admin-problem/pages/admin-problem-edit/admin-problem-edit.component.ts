import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ProblemData } from '@app/models/problem';
import { ProblemService } from '@app/services/problem.service';
import { injectQuery } from '@bidv-api/angular';
import { AdminProblemFormComponent } from '../components/admin-problem-form/admin-problem-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-problem-edit',
  standalone: true,
  imports: [CommonModule, AdminProblemFormComponent],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemEditComponent {
  // #activatedRoute = inject(ActivatedRoute);
  // #problemService = inject(ProblemService);
  // #destroyRef = inject(DestroyRef);
  // #query = injectQuery();
  // // Data
  // protected problemId = this.#activatedRoute.snapshot.params['id'];
  // protected problemData: ProblemData | null = null;
  // // Queries
  // #problemQuery = this.#query({
  //   queryKey: ['problem-detail-edit'],
  //   queryFn: () => this.#problemService.getProblemDetail(this.problemId),
  //   refetchOnWindowFocus: false,
  // });
  // ngOnInit(): void {
  //   this.#problemQuery.result$
  //     .pipe(takeUntilDestroyed(this.#destroyRef))
  //     .subscribe((res) => {
  //       if (!res.data) return;
  //       this.problemData = res.data.data;
  //     });
  // }
}
