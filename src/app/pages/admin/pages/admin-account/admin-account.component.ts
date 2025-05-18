import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ErrorResponse, LinkItem, SelectItem } from '@app/models';
import { AccountData, GetAccountsParams } from '@app/models/user';
import { BreadcrumbsComponent } from '@app/pages/components/breadcrumbs/breadcrumbs.component';
import { UserService } from '@app/services/user.service';
import {
  ColDef,
  ColGroupDef,
  GridOptions,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { BaseTableComponent } from '@app/pages/components/base-table/base-table.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BidvInputModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import { debounceTime } from 'rxjs';
import { CouponService } from '@app/services/coupon.service';
import { injectMutation, injectQuery } from '@bidv-api/angular';
import { HavePagination } from '@app/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SingleSelectDropdownComponent } from '../../../components/single-select-dropdown/single-select-dropdown.component';
import { BidvDay } from '@bidv-ui/cdk';
import { DialogService } from '@app/services/share/dialog.service';
import { AdminAccountStudentCellComponent } from './components/admin-account-student-cell/admin-account-student-cell.component';
import { Role } from '@app/enums/user';
import { ROLES } from '@app/constants/user';
import { AdminAccountStatusCellComponent } from './components/admin-account-status-cell/admin-account-status-cell.component';
import { ApplyCouponBody } from '@app/models/coupon';

interface FilterForm {
  search: FormControl<string>;
}

@Component({
  selector: 'app-admin-account',
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    BaseTableComponent,
    ReactiveFormsModule,
    BidvInputModule,
    BidvTextfieldControllerModule,
    BidvSelectModule,
    BidvDataListModule,
    SingleSelectDropdownComponent,
    BidvButtonModule,
  ],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
  ],
})
export class AdminAccountComponent {
  #userService = inject(UserService);
  #couponService = inject(CouponService);
  #query = injectQuery();
  #mutation = injectMutation();
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #dialogs = inject(DialogService);
  #alerts = inject(BidvAlertService);

  // Properties
  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Danh sách tài khoản',
    },
  ];

  // Data
  protected filterForm = new FormGroup<FilterForm>({
    search: new FormControl('', {
      nonNullable: true,
    }),
  });

  protected couponControl = new FormControl<SelectItem | null>(null);

  protected accountsData: AccountData[] = [];
  protected couponList: SelectItem[] = [];

  protected params: GetAccountsParams = {
    page: 1,
    limit: 20,
  };

  // Queries
  protected getAccountsQuery = (params: GetAccountsParams) =>
    this.#userService.getAccounts(params);

  #getCouponsQuery = this.#query({
    queryKey: ['admin-coupons'],
    queryFn: () =>
      this.#couponService.getAllCoupons({
        paging: HavePagination.N,
      }),
    refetchOnWindowFocus: false,
  });

  // Mutations
  #applyCouponMutation = this.#mutation({
    mutationFn: (body: ApplyCouponBody) =>
      this.#couponService.applyCoupon(body),
    onSuccess: () => {
      this.#alerts
        .open('', {
          status: 'success',
          label: 'Áp dụng mã giảm giá cho học viên thành công',
        })
        .subscribe();
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

  protected applyCouponResult = this.#applyCouponMutation.result;

  // Table config
  protected columnDefs: Array<ColDef | ColGroupDef> = [];
  protected gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    rowSelection: {
      mode: 'multiRow',
    },
    suppressClickEdit: true,
    onSelectionChanged: this.selectionChanged.bind(this),
  };

  // Lifecycle
  constructor() {
    this.createColumnDefs();
    this.initCouponData();
    this.trackFilter();
  }

  // Init data
  private initCouponData() {
    this.#getCouponsQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        const couponsData = res.data.data;
        this.couponList = couponsData.map((item) => ({
          label: item.code,
          value: item.code,
        }));

        this.#cdr.markForCheck();
      });
  }

  private trackFilter() {
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((value) => {
        if (value === null) return;

        if (value.length === 0) {
          delete this.params.search;
          this.params = { ...this.params };
        } else {
          this.params = {
            ...this.params,
            search: value,
          };
        }

        this.#cdr.markForCheck();
      });
  }

  // Init table
  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'id',
        field: 'id',
        hide: true,
      },
      {
        headerName: 'STT',
        field: 'no',
        width: 80,
      },
      {
        headerName: 'Học viên',
        width: 350,
        cellRenderer: AdminAccountStudentCellComponent,
        tooltipField: 'fullName',
      },
      {
        headerName: 'Vai trò',
        field: 'role',
        width: 150,
        cellStyle: {
          fontWeight: '500',
        },
        valueGetter: (params) => {
          const role = params.data.role as Role;
          return ROLES[role];
        },
      },
      {
        headerName: 'Số điện thoại',
        field: 'phoneNumber',
        width: 200,
        valueGetter: (params) => {
          const phoneNumber = params.data.phoneNumber;
          return phoneNumber ?? 'Chưa có';
        },
      },
      {
        headerName: 'Ngày sinh',
        field: 'dateOfBirth',
        width: 200,
        valueGetter: (params) => {
          const dateOfBirth = params.data.dateOfBirth;
          return dateOfBirth
            ? BidvDay.fromUtcNativeDate(new Date(dateOfBirth)).getFormattedDay(
                'DMY',
                '/',
              )
            : 'Chưa có';
        },
      },
      {
        headerName: 'Tình trạng xác thực',
        field: 'verified',
        cellRenderer: AdminAccountStatusCellComponent,
        sortable: true,
        width: 200,
      },
      {
        headerName: 'Ngày tạo tài khoản',
        field: 'createdAt',
        sortable: true,
        width: 250,
        valueFormatter: (params) => {
          const createdAt = params.data.createdAt;

          return BidvDay.fromUtcNativeDate(new Date(createdAt)).getFormattedDay(
            'DMY',
            '/',
          );
        },
      },
    ];
  }

  // Handlers
  protected handleApplyCoupon() {
    this.#dialogs
      .openConfirmDialog(
        `Bạn có chắc chắn muốn áp dụng mã giảm giá ${this.couponControl.value?.label} cho học viên không?`,
      )
      .subscribe((status: any) => {
        if (!status || !this.couponControl.value?.value) return;

        for (const account of this.accountsData) {
          this.#applyCouponMutation.mutate({
            code: this.couponControl.value.value as string,
            userId: account.id,
          });
        }

        this.couponControl.reset();
      });
  }

  private selectionChanged(event: SelectionChangedEvent) {
    this.accountsData = event.api.getSelectedRows();

    if (this.accountsData.length === 0) this.couponControl.reset();

    this.#cdr.markForCheck();
  }
}
