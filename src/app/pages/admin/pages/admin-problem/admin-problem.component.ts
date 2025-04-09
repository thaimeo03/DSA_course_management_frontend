import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-problem',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: `
    :host {
      flex-grow: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProblemComponent {}
