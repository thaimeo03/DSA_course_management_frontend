import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataType } from '@app/enums/data-types';
import { SelectItem } from '@app/models';
import { TestSuiteData } from '@app/models/test-suite';
import { TestSuiteService } from '@app/services/test-suite.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  queryOptions,
} from '@bidv-api/angular';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvDataListModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvDataListWrapperModule,
  BidvDividerDirective,
  BidvFieldErrorPipeModule,
  BidvInputModule,
  BidvSelectModule,
  BidvTextareaModule,
  bidvItemsHandlersProvider,
} from '@bidv-ui/kit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/services/share/dialog.service';

interface TestSuiteForm {
  functionName: FormControl<string>;
  outputType: FormControl<SelectItem | null>;
  expectedOutputSuit: FormControl<string>;
  inputTypes: FormArray<FormControl<SelectItem | null>>;
  inputSuit: FormControl<string>;
}

@Component({
  selector: 'app-admin-problem-test-suite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvSelectModule,
    BidvDataListWrapperModule,
    BidvButtonModule,
    BidvDataListModule,
    BidvDividerDirective,
    BidvTextfieldControllerModule,
    BidvInputModule,
    BidvTextareaModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
  ],
  templateUrl: './admin-problem-test-suite.component.html',
  styleUrl: './admin-problem-test-suite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'Trường này là bắt buộc',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          `Độ dài tối thiểu — ${requiredLength}`,
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          `Độ dài tối đa — ${requiredLength}`,
      },
    },
  ],
})
export class AdminProblemTestSuiteComponent implements OnInit {
  #testSuiteService = inject(TestSuiteService);
  #dialogs = inject(DialogService);
  #alerts = inject(BidvAlertService);
  #query = injectQuery();
  #queryClient = injectQueryClient();
  #mutation = injectMutation();
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) problemId!: string;

  protected isEditMode = false;
  protected testSuiteData: TestSuiteData | null = null;
  protected dataTypeOptions: SelectItem[] = Object.values(DataType).map(
    (type) => ({
      label: type,
      value: type,
    }),
  );
  protected inputSuitPlaceholder = 'Ví dụ:\n[-1,2,1,-4]\n1\n[0,0,0]\n1';
  protected expectedOutputSuitPlaceholder = 'Ví dụ:\n-1\n1';

  protected testSuiteForm: FormGroup<TestSuiteForm> =
    new FormGroup<TestSuiteForm>({
      functionName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      outputType: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      expectedOutputSuit: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      inputTypes: new FormArray([
        new FormControl<SelectItem | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      ]),
      inputSuit: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

  // Query options
  private getTestSuiteOptions = (problemId: string | null) =>
    queryOptions({
      enabled: !!problemId,
      queryKey: ['test-suite', problemId],
      queryFn: () => {
        if (!problemId) return;
        return this.#testSuiteService.getTestSuiteByProblemId(problemId);
      },
      refetchOnWindowFocus: false,
    });

  // Queries
  #getTestSuiteQuery = this.#query(this.getTestSuiteOptions(this.problemId));

  // Mutations
  #createTestSuiteMutation = this.#mutation({
    mutationFn: (body: any) => this.#testSuiteService.createTestSuite(body),
    onSuccess: () => {
      this.#queryClient.refetchQueries({
        queryKey: ['test-suite'],
      });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo bộ kiểm thử thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo bộ kiểm thử thất bại',
        })
        .subscribe();
    },
  });

  #updateTestSuiteMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      this.#testSuiteService.updateTestSuite(id, body),
    onSuccess: () => {
      this.isEditMode = false;

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật bộ kiểm thử thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật bộ kiểm thử thất bại',
        })
        .subscribe();
    },
  });

  #deleteTestSuiteMutation = this.#mutation({
    mutationFn: (id: string) => this.#testSuiteService.deleteTestSuite(id),
    onSuccess: () => {
      this.testSuiteData = null;
      this.isEditMode = false;
      this.testSuiteForm.reset();

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa bộ kiểm thử thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Xóa bộ kiểm thử thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  constructor() {
    this.initData();
  }

  ngOnInit(): void {
    this.#getTestSuiteQuery.updateOptions(
      this.getTestSuiteOptions(this.problemId),
    );
  }

  private initData(): void {
    this.#getTestSuiteQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data || !res.data.data) {
          this.testSuiteData = null;
          this.#cdr.markForCheck();
          return;
        }

        this.testSuiteData = res.data.data;
        this.populateForm(this.testSuiteData);
        this.#cdr.markForCheck();
      });
  }

  private populateForm(data: TestSuiteData): void {
    // Clear existing input types array
    while (this.inputTypesArray.length) {
      this.inputTypesArray.removeAt(0);
    }

    // Add form controls for each input type
    data.inputTypes.forEach((type) => {
      const selectedType = this.dataTypeOptions.find(
        (option) => option.value === type,
      );
      this.inputTypesArray.push(
        new FormControl<SelectItem | null>(selectedType || null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      );
    });

    // Set other form values
    const selectedOutputType = this.dataTypeOptions.find(
      (option) => option.value === data.outputType,
    );

    this.testSuiteForm.patchValue({
      functionName: data.functionName,
      outputType: selectedOutputType || null,
      expectedOutputSuit: data.expectedOutputSuit,
      inputSuit: data.inputSuit,
    });
  }

  protected addInputType(): void {
    this.inputTypesArray.push(
      new FormControl<SelectItem | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  protected removeInputType(index: number): void {
    if (this.inputTypesArray.length > 1) {
      this.inputTypesArray.removeAt(index);
    }
  }

  // Handlers
  protected handleSubmit(): void {
    if (this.testSuiteForm.invalid) {
      this.testSuiteForm.markAllAsTouched();
      return;
    }

    const formValue = this.testSuiteForm.value;
    const inputTypes =
      formValue.inputTypes?.map((item) => item?.value as string) || [];

    const testSuiteData = {
      functionName: formValue.functionName,
      inputTypes: inputTypes,
      inputSuit: formValue.inputSuit,
      outputType: formValue.outputType?.value,
      expectedOutputSuit: formValue.expectedOutputSuit,
      problemId: this.problemId,
    };

    if (this.testSuiteData && this.isEditMode) {
      // Update
      const { problemId, ...updateData } = testSuiteData;
      this.#updateTestSuiteMutation.mutate({
        id: this.testSuiteData.id,
        body: updateData,
      });
    } else {
      // Create
      this.#createTestSuiteMutation.mutate(testSuiteData);
    }
  }

  protected handleEdit(): void {
    this.isEditMode = true;
  }

  protected handleCancelEdit(): void {
    if (this.testSuiteData) {
      this.populateForm(this.testSuiteData);
    }
    this.isEditMode = false;
  }

  protected handleDelete(): void {
    if (!this.testSuiteData) return;

    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa bộ kiểm thử này?')
      .subscribe((status: any) => {
        if (!status) return;
        this.#deleteTestSuiteMutation.mutate(this.testSuiteData!.id);
      });
  }

  // Getters
  protected get inputTypesArray() {
    return this.testSuiteForm.get('inputTypes') as FormArray<
      FormControl<SelectItem | null>
    >;
  }
}
