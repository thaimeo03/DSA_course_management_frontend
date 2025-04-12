import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkItem, SelectItem } from '@app/models';
// import {
//   CreateProblemBody,
//   ProblemData,
//   UpdateProblemBody,
// } from '@app/models/problem';
import { ProblemService } from '@app/services/problem.service';
import { injectMutation } from '@bidv-api/angular';
import { ROUTES } from '@app/constants/routes';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvDataListWrapperModule,
  BidvDividerDirective,
  BidvFieldErrorPipeModule,
  BidvInputModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { of } from 'rxjs';
import { EditorComponent } from '@app/pages/components/editor/editor.component';
import { CodeMirrorEditorComponent } from '@app/pages/components/code-mirror-editor/code-mirror-editor.component';
import { Difficulty } from '@app/enums/problem';
import { CreateProblemBody } from '@app/models/problem';

interface ProblemForm {
  title: FormControl<string>;
  content: FormControl<string>;
  difficulty: FormControl<SelectItem>;
  point: FormControl<string>;
}

@Component({
  selector: 'app-admin-problem-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    BidvInputModule,
    BidvSelectModule,
    BidvButtonModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
    BidvDividerDirective,
    EditorComponent,
    BidvDataListWrapperModule,
  ],
  templateUrl: './admin-problem-form.component.html',
  styleUrl: './admin-problem-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: () => of('Trường này không được để trống'),
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        min: ({ min }: { min: string }) => of(`Giá trị tối thiểu — ${min}`),
        max: ({ max }: { max: string }) => of(`Giá trị tối đa — ${max}`),
        pattern: () => of('Định dạng không hợp lệ'),
      },
    },
  ],
})
export class AdminProblemFormComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #problemService = inject(ProblemService);
  #alerts = inject(BidvAlertService);
  #mutation = injectMutation();

  @Input() problemData?: any | null = null;

  // Properties
  protected title = '';
  protected breadcrumbs: LinkItem[] = [];
  protected difficultyOptions: SelectItem[] = [
    {
      label: 'Dễ',
      value: Difficulty.Easy,
    },
    {
      label: 'Trung bình',
      value: Difficulty.Medium,
    },
    {
      label: 'Khó',
      value: Difficulty.Hard,
    },
  ];

  // Data
  private courseId = this.#activatedRoute.snapshot.queryParams['courseId'];

  // Form
  protected problemForm!: FormGroup<ProblemForm>;

  // Mutations
  #createProblemMutation = this.#mutation({
    mutationFn: (body: CreateProblemBody) =>
      this.#problemService.createProblem(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo bài tập thành công',
        })
        .subscribe();

      // Navigate to problem list page
      this.#router.navigate([ROUTES.adminProblem]);
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo bài tập thất bại',
        })
        .subscribe();
    },
  });

  // #updateProblemMutation = this.#mutation({
  //   mutationFn: ({ id, body }: { id: string; body: UpdateProblemBody }) =>
  //     this.#problemService.updateProblem(id, body),
  //   onSuccess: () => {
  //     this.#alerts
  //       .open('', {
  //         status: 'success',
  //         label: 'Cập nhật bài tập thành công',
  //       })
  //       .subscribe();

  //     // Navigate to problem detail page
  //     this.#router.navigate([ROUTES.adminProblem, this.problemData?.id]);
  //   },
  //   onError: () => {
  //     this.#alerts
  //       .open('', {
  //         status: 'error',
  //         label: 'Cập nhật bài tập thất bại',
  //       })
  //       .subscribe();
  //   },
  // });

  // Lifecycle
  ngOnInit(): void {
    this.problemForm = this.initForm();
    this.initUI();
  }

  // Init data
  private initUI(): void {
    if (this.problemData) {
      // Edit mode
      this.title = 'Cập nhật bài tập';
      this.breadcrumbs = [
        {
          label: 'Danh sách bài tập',
          link: ROUTES.adminProblem,
        },
        {
          label: 'Chi tiết bài tập',
          link: [ROUTES.adminProblem, this.problemData.id],
        },
        {
          label: 'Cập nhật bài tập',
        },
      ];
    } else {
      // Create mode
      this.title = 'Tạo mới bài tập';
      this.breadcrumbs = [
        {
          label: 'Danh sách bài tập',
          link: ROUTES.adminProblem,
        },
        {
          label: 'Tạo mới bài tập',
        },
      ];
    }
  }

  private initForm() {
    return new FormGroup<ProblemForm>({
      title: new FormControl(this.problemData?.title ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      content: new FormControl(this.problemData?.description ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      difficulty: new FormControl(this.problemData?.difficulty ?? null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      point: new FormControl(this.problemData?.point ?? 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  // Handlers
  protected handleSubmit(): void {
    if (this.problemForm.invalid) {
      this.problemForm.markAllAsTouched();
      return;
    }

    const formValue = this.problemForm.value;

    const problemData: Omit<CreateProblemBody, 'courseId'> = {
      title: formValue.title as string,
      content: formValue.content as string,
      point: Number.parseInt(formValue.point as string),
      difficulty: formValue.difficulty?.value,
    };

    if (this.problemData) {
      // Update problem
      // this.#updateProblemMutation.mutate({
      //   id: this.problemData.id,
      //   body: problemData,
      // });
    } else {
      // Create new problem
      this.#createProblemMutation.mutate({
        ...problemData,
        courseId: this.courseId,
      });
    }
  }

  protected handleCancel(): void {
    if (this.problemData) {
      // Navigate back to problem detail
      this.#router.navigate([ROUTES.adminProblem, this.problemData.id]);
    } else {
      // Navigate back to problem list
      this.#router.navigate([ROUTES.adminProblem]);
    }
  }
}
