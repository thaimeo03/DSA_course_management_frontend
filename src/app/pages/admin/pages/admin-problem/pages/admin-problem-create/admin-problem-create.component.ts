import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminProblemFormComponent } from '../components/admin-problem-form/admin-problem-form.component';

@Component({
  selector: 'app-admin-problem-create',
  standalone: true,
  imports: [AdminProblemFormComponent],
  template: '<app-admin-problem-form />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemCreateComponent {}
