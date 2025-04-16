import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { CouponType } from '@app/enums/coupon';
import { LinkItem, SelectItem } from '@app/models';
import {
  CouponData,
  CreateCouponBody,
  UpdateCouponBody,
} from '@app/models/coupon';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { CouponService } from '@app/services/coupon.service';
import { injectMutation, injectQueryClient } from '@bidv-api/angular';
import { BidvDay, BidvTime } from '@bidv-ui/cdk';
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
  BidvInputDateTimeModule,
  BidvInputModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import { of } from 'rxjs';

interface CouponForm {
  type: FormControl<SelectItem | null>;
  code: FormControl<string>;
  percentOff: FormControl<string | null>;
  amountOff: FormControl<string | null>;
  maxRedeem: FormControl<string | null>;
  expiredAt: FormControl<[BidvDay | null, BidvTime] | null>;
}

@Component({
  selector: 'app-admin-coupon-form',
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
    BidvInputDateTimeModule,
    BidvDataListWrapperModule,
  ],
  templateUrl: './admin-coupon-form.component.html',
  styleUrl: './admin-coupon-form.component.scss',
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
export class AdminCouponFormComponent implements OnInit {
  #router = inject(Router);
  #couponService = inject(CouponService);
  #alerts = inject(BidvAlertService);
  #mutation = injectMutation();
  #queryClient = injectQueryClient();

  @Input() couponData: CouponData | null = null;

  // Properties
  protected title = '';
  protected breadcrumbs: LinkItem[] = [];
  protected couponTypes: SelectItem[] = [
    { label: 'Giảm theo phần trăm', value: CouponType.PercentOff },
    { label: 'Giảm theo số tiền', value: CouponType.AmountOff },
  ];
  protected CouponType = CouponType;

  // Data
  protected minDate = BidvDay.currentLocal().append({ day: 1 });
  protected couponForm!: FormGroup<CouponForm>;

  // Mutations
  #createCouponMutation = this.#mutation({
    mutationFn: (body: CreateCouponBody) =>
      this.#couponService.createCoupon(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Tạo mã giảm giá thành công',
        })
        .subscribe();

      // Navigate to coupon list page
      this.#router.navigate([ROUTES.adminCoupon]);
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Tạo mã giảm giá thất bại',
        })
        .subscribe();
    },
  });

  #updateCouponMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCouponBody }) =>
      this.#couponService.updateCoupon(id, body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật mã giảm giá thành công',
        })
        .subscribe();

      // Navigate to coupon list page
      this.#queryClient.resetQueries({
        queryKey: ['admin-coupon-detail'],
      });
      this.#router.navigate([ROUTES.adminCoupon]);
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật mã giảm giá thất bại',
        })
        .subscribe();
    },
  });

  protected createCouponResult = this.#createCouponMutation.result;
  protected updateCouponResult = this.#updateCouponMutation.result;

  // Lifecycle
  ngOnInit(): void {
    this.couponForm = this.initForm();
    this.initUI();
    this.subscribeToTypeChanges();
  }

  // Init data
  private initUI(): void {
    if (this.couponData) {
      // Edit mode
      this.title = 'Cập nhật mã giảm giá';
      this.breadcrumbs = [
        {
          label: 'Danh sách mã giảm giá',
          link: ROUTES.adminCoupon,
        },
        {
          label: 'Cập nhật mã giảm giá',
        },
      ];
    } else {
      // Create mode
      this.title = 'Tạo mới mã giảm giá';
      this.breadcrumbs = [
        {
          label: 'Danh sách mã giảm giá',
          link: ROUTES.adminCoupon,
        },
        {
          label: 'Tạo mới mã giảm giá',
        },
      ];
    }
  }

  private initForm() {
    const typeItem = this.couponTypes.find(
      (item) => item.value === this.couponData?.type,
    );

    const form = new FormGroup<CouponForm>({
      type: new FormControl(typeItem ?? null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      code: new FormControl(this.couponData?.code ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      percentOff: new FormControl(
        this.couponData?.percentOff?.toString() ?? null,
        {
          validators: [Validators.min(0), Validators.max(100)],
        },
      ),
      amountOff: new FormControl(
        this.couponData?.amountOff?.toString() ?? null,
        {
          validators: [Validators.min(0)],
        },
      ),
      maxRedeem: new FormControl(
        this.couponData?.maxRedeem?.toString() ?? null,
        {
          validators: [Validators.min(1)],
        },
      ),
      expiredAt: new FormControl(
        this.couponData?.expiredAt
          ? [
              BidvDay.fromLocalNativeDate(new Date(this.couponData.expiredAt)),
              BidvTime.fromLocalNativeDate(new Date(this.couponData.expiredAt)),
            ]
          : [null, new BidvTime(8, 0)],
      ),
    });

    // Set initial validators based on coupon type
    if (this.couponData?.type === CouponType.PercentOff) {
      form.get('amountOff')?.disable();
      form.get('percentOff')?.addValidators(Validators.required);
    } else if (this.couponData?.type === CouponType.AmountOff) {
      form.get('percentOff')?.disable();
      form.get('amountOff')?.addValidators(Validators.required);
    }

    return form;
  }

  private subscribeToTypeChanges() {
    this.couponForm.get('type')?.valueChanges.subscribe((item) => {
      if (item?.value === CouponType.PercentOff) {
        this.percentOff.enable();
        this.percentOff.addValidators(Validators.required);
        this.percentOff.markAsUntouched();

        this.amountOff.disable();
        this.amountOff.clearValidators();
        this.amountOff.setValue(null);
      } else if (item?.value === CouponType.AmountOff) {
        this.amountOff.enable();
        this.amountOff.addValidators(Validators.required);
        this.amountOff.markAsUntouched();

        this.percentOff.disable();
        this.percentOff.clearValidators();
        this.percentOff.setValue(null);
      }

      this.percentOff.updateValueAndValidity();
      this.amountOff.updateValueAndValidity();
    });
  }

  // Handlers
  protected handleSubmit(): void {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }

    const formValue = this.couponForm.getRawValue();
    const [day, time] = formValue.expiredAt ?? [null, null];
    const expiredAt = day
      ? `${day.toString('YMD', '-')}T${time.toString('HH:MM:SS')}`
      : null;

    const couponData: CreateCouponBody | UpdateCouponBody = {
      type: formValue.type?.value as CouponType,
      code: formValue.code,
      percentOff: formValue.percentOff ? +formValue.percentOff : null,
      amountOff: formValue.amountOff ? +formValue.amountOff : null,
      maxRedeem: formValue.maxRedeem ? +formValue.maxRedeem : null,
      expiredAt: expiredAt,
    };

    if (this.couponData) {
      // Update coupon
      this.#updateCouponMutation.mutate({
        id: this.couponData.id,
        body: couponData,
      });
    } else {
      // Create new coupon
      this.#createCouponMutation.mutate(couponData as CreateCouponBody);
    }
  }

  protected handleCancel(): void {
    this.#router.navigate([ROUTES.adminCoupon]);
  }

  // Getters
  private get percentOff() {
    return this.couponForm.get('percentOff') as FormControl<string | null>;
  }

  private get amountOff() {
    return this.couponForm.get('amountOff') as FormControl<string | null>;
  }
}
