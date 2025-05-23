import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse, LinkItem, SelectItem } from '@app/models';
import { ProblemService } from '@app/services/problem.service';
import { injectMutation, injectQueryClient } from '@bidv-api/angular';
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
import { Difficulty } from '@app/enums/problem';
import {
  CreateProblemBody,
  ProblemRepositoryData,
  UpdateProblemBody,
} from '@app/models/problem';

interface ProblemForm {
  title: FormControl<string>;
  content: FormControl<string>;
  difficulty: FormControl<SelectItem | null>;
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
  #queryClient = injectQueryClient();

  @Input() problemData: ProblemRepositoryData | null = null;

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
    onError: (error: ErrorResponse) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: error.error.message,
        })
        .subscribe();
    },
  });

  #updateProblemMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateProblemBody }) =>
      this.#problemService.updateProblem(id, body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật bài tập thành công',
        })
        .subscribe();

      this.#queryClient.removeQueries({
        queryKey: ['problem-detail-edit'],
      });

      // Navigate to problem detail page
      this.#router.navigate([ROUTES.adminProblem, this.problemData?.id]);
    },
    onError: (error: ErrorResponse) => {
      this.#alerts
        .open('', {
          status: 'error',
          label: error.error.message,
        })
        .subscribe();
    },
  });

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
    console.log;
    return new FormGroup<ProblemForm>({
      title: new FormControl(this.problemData?.title ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      content: new FormControl(this.problemData?.content ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      difficulty: new FormControl(
        this.difficultyOptions.find(
          (item) => item.value === this.problemData?.difficulty,
        ) ?? null,
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      point: new FormControl(this.problemData?.point.toString() ?? '0', {
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
      point: +(formValue.point as string),
      difficulty: formValue.difficulty?.value,
    };

    if (this.problemData) {
      // Update problem
      this.#updateProblemMutation.mutate({
        id: this.problemData.id,
        body: problemData,
      });
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
