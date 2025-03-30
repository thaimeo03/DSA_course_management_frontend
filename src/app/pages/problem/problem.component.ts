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
import {
  BidvButtonModule,
  BidvDialogService,
  BidvScrollbarComponent,
} from '@bidv-ui/core';
import { injectMutation, injectQueryClient } from '@bidv-api/angular';
import { ExecuteCodeBody, SubmissionHistoryData } from '@app/models/submission';
import { SubmissionService } from '@app/services/submission.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionHistoryComponent } from './components/submission-history/submission-history.component';
import { SubmissionStatus } from '@app/enums/submission';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgrammingLanguage } from '@app/enums';

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
  #dialogs = inject(BidvDialogService);
  #mutation = injectMutation();
  #queryClient = injectQueryClient();

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
  protected language: ProgrammingLanguage = ProgrammingLanguage.Javascript;

  // Mutation
  #executeCodeMutation = this.#mutation({
    mutationFn: (body: ExecuteCodeBody) =>
      this.#submissionService.executeCode(body),
    onSuccess: (res) => {
      if (res.data.status === SubmissionStatus.Passed) {
        this.#dialogs
          .success('', {
            label: 'Chúc mừng bạn đã hoàn thành bài toán',
            actionFooter: false,
          })
          .subscribe();
      } else {
        this.#dialogs
          .error(res.data.message, {
            label: 'Có lỗi xảy ra',
            actionFooter: false,
          })
          .subscribe();
      }

      this.#queryClient.invalidateQueries({ queryKey: ['submission-history'] });
    },
    onError: (err: HttpErrorResponse) => {
      this.#dialogs
        .error(err.error.message, {
          label: 'Có lỗi xảy ra',
          actionFooter: false,
        })
        .subscribe();
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
      problemId: this.problemId,
    });
  }

  protected handleSubmissionHistory(data: SubmissionHistoryData) {
    this.code = data.sourceCode.code;
    this.language = data.sourceCode.language as ProgrammingLanguage;
  }
}
