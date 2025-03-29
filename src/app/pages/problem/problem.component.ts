import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { CodeMirrorEditorComponent } from '../components/code-mirror-editor/code-mirror-editor.component';
import { LinkItem, SelectItem } from '@app/models';
import { ROUTES } from '@app/constants/routes';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { BidvTabsModule } from '@bidv-ui/kit';
import { BidvButtonModule, BidvScrollbarComponent } from '@bidv-ui/core';
import { injectMutation } from '@bidv-api/angular';
import { ExecuteCodeBody, SubmissionHistoryData } from '@app/models/submission';
import { SubmissionService } from '@app/services/submission.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionHistoryComponent } from './components/submission-history/submission-history.component';

@Component({
  selector: 'app-problem',
  imports: [
    CommonModule,
    CodeMirrorEditorComponent,
    BreadcrumbsComponent,
    BidvTabsModule,
    BidvButtonModule,
    BidvScrollbarComponent,
    SubmissionHistoryComponent,
  ],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemComponent {
  #activatedRoute = inject(ActivatedRoute);
  #submissionService = inject(SubmissionService);
  #mutation = injectMutation();

  @ViewChild(CodeMirrorEditorComponent, { static: true })
  codeMirrorEditor!: CodeMirrorEditorComponent;

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'Problem',
    },
  ];

  protected activeItemIndex = 0;

  // Data
  protected problemId!: string;
  protected code = '';

  // Mutation
  #executeCodeMutation = this.#mutation({
    mutationFn: (body: ExecuteCodeBody) =>
      this.#submissionService.executeCode(body),
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.#activatedRoute.params.subscribe((params) => {
      this.problemId = params['problemId'];
    });
  }

  // Handlers
  protected handleSubmit() {
    const code = this.codeMirrorEditor.code;
    const language = this.codeMirrorEditor.codeEditorForm.get('language')
      ?.value as SelectItem | undefined;

    if (!code || !language) return;

    this.#executeCodeMutation.mutate({
      code: code,
      language: language.value,
      problemId: '2f7a4c15-a2ad-41a4-922e-603fed97688d', // Hardcoded
    });
  }

  protected handleSubmissionHistory(data: SubmissionHistoryData) {
    this.code = data.sourceCode.code;
  }
}
