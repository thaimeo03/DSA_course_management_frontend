import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeMirrorEditorComponent } from '../components/code-mirror-editor/code-mirror-editor.component';
import { LinkItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-problem',
  imports: [CommonModule, CodeMirrorEditorComponent, BreadcrumbsComponent],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemComponent {
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'Problem',
    },
  ];
}
