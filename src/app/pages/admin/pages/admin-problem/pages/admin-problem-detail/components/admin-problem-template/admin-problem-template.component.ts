import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PROGRAMMING_LANGUAGE } from '@app/constants';
import { ProgrammingLanguage } from '@app/enums';
import { SelectItem } from '@app/models';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvDataListModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BidvDataListWrapperModule,
  BidvFieldErrorPipeModule,
  BidvSelectModule,
  bidvItemsHandlersProvider,
} from '@bidv-ui/kit';
import { CodeMirrorEditorComponent } from '@app/pages/components/code-mirror-editor/code-mirror-editor.component';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@bidv-api/angular';
import { TemplateService } from '@app/services/template.service';
import { DialogService } from '@app/services/share/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTemplateBody } from '@app/models/template';

@Component({
  selector: 'app-admin-problem-template',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvSelectModule,
    BidvDataListWrapperModule,
    BidvButtonModule,
    BidvDataListModule,
    BidvTextfieldControllerModule,
    CodeMirrorEditorComponent,
    BidvErrorModule,
  ],
  templateUrl: './admin-problem-template.component.html',
  styleUrl: './admin-problem-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
  ],
})
export class AdminProblemTemplateComponent implements OnInit {
  #templateService = inject(TemplateService);
  #dialogs = inject(DialogService);
  #alerts = inject(BidvAlertService);
  #query = injectQuery();
  #queryClient = injectQueryClient();
  #mutation = injectMutation();
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);

  @ViewChild(CodeMirrorEditorComponent, { static: true })
  codeMirrorEditor!: CodeMirrorEditorComponent;

  @Input({ required: true }) problemId!: string;

  protected code: string = '';
  protected language: ProgrammingLanguage = ProgrammingLanguage.Javascript;
  protected currentTemplateId: string | null = null;
  protected isEditMode: boolean = false;
  protected errorMessage: string | null = null;

  // Queries
  #templateQuery = this.#query({
    queryKey: ['template'],
    queryFn: () => {
      return this.#templateService.getTemplate({
        language: this.language,
        problemId: this.problemId,
      });
    },
    refetchOnWindowFocus: false,
  });

  // Mutations
  #createTemplateMutation = this.#mutation({
    mutationFn: (body: CreateTemplateBody) =>
      this.#templateService.createTemplate(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo mẫu code thành công',
        })
        .subscribe();

      this.isEditMode = true;

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo mẫu code thất bại',
        })
        .subscribe();
    },
  });

  #updateTemplateMutation = this.#mutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { code: string; language: number };
    }) => this.#templateService.updateTemplate(id, body),
    onSuccess: () => {
      this.isEditMode = false;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật mẫu code thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật mẫu code thất bại',
        })
        .subscribe();
    },
  });

  #deleteTemplateMutation = this.#mutation({
    mutationFn: (id: string) => this.#templateService.deleteTemplate(id),
    onSuccess: () => {
      this.code = '';
      this.currentTemplateId = null;
      this.isEditMode = false;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa mẫu code thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Xóa mẫu code thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  ngOnInit(): void {
    this.initData();
  }

  // Init data
  private initData(): void {
    this.#templateQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data || !res.data.data) {
          this.code = '';
          this.currentTemplateId = null;
          this.isEditMode = false;
          this.#cdr.markForCheck();
          return;
        }

        const templateData = res.data.data;
        this.code = templateData.code;
        this.currentTemplateId = templateData.id;
        this.#cdr.markForCheck();
      });
  }

  // Handlers
  protected handleLanguageChange(language: ProgrammingLanguage): void {
    this.language = language;

    this.#queryClient.invalidateQueries({
      queryKey: ['template'],
    });
  }

  protected handleSaveTemplate(): void {
    const code = this.codeMirrorEditor.code;

    if (!code) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.errorMessage = null;

    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn lưu mẫu code này?')
      .subscribe((status: any) => {
        if (!status) return;

        if (this.currentTemplateId && this.isEditMode) {
          this.#updateTemplateMutation.mutate({
            id: this.currentTemplateId,
            body: {
              code: code,
              language: this.language,
            },
          });
        } else {
          this.#createTemplateMutation.mutate({
            code: code,
            language: this.language,
            problemId: this.problemId,
          });
        }
      });
  }

  protected handleEditTemplate(): void {
    this.isEditMode = true;
  }

  protected handleCancelEdit(): void {
    this.isEditMode = false;

    this.#queryClient.invalidateQueries({
      queryKey: ['template'],
    });
  }

  protected handleDeleteTemplate(): void {
    if (!this.currentTemplateId) return;

    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa mẫu code này?')
      .subscribe((status: any) => {
        if (!status) return;

        this.#deleteTemplateMutation.mutate(this.currentTemplateId as string);
      });
  }
}
