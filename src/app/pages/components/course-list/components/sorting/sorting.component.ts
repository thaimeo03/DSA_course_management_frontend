import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Order } from '@app/enums';
import { CourseSortBy } from '@app/enums/course';
import {
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BidvDataListWrapperModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import { debounceTime, map } from 'rxjs';
import { SelectItem } from 'src/app/models';

export interface SortingChangeEvent {
  field: CourseSortBy;
  order: Order;
}

@Component({
  selector: 'app-sorting',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvSelectModule,
    BidvDataListModule,
    BidvDataListWrapperModule,
    BidvTextfieldControllerModule,
  ],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.scss',
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
  ],
})
export class SortingComponent {
  @Output() sortingChangeEvent = new EventEmitter<SortingChangeEvent>();

  protected sortByCreatedAts: SelectItem[] = [
    {
      label: 'Mới nhất',
      value: {
        field: CourseSortBy.CREATED_AT,
        order: Order.Desc,
      },
    },
    {
      label: 'Cũ nhất',
      value: {
        field: CourseSortBy.CREATED_AT,
        order: Order.Asc,
      },
    },
  ];

  protected sortByPrices: SelectItem[] = [
    {
      label: 'Giá: Thấp đến cao',
      value: {
        field: 'price',
        order: 'asc',
      },
    },
    {
      label: 'Giá: Cao đến thấp',
      value: {
        field: 'price',
        order: 'desc',
      },
    },
  ];

  protected sortingForm = new FormGroup({
    sortByCreatedAt: new FormControl<SelectItem | null>(
      this.sortByCreatedAts[0],
    ),
    sortByPrice: new FormControl<SelectItem | null>(null),
  });

  constructor() {
    this.sortingForm
      .get('sortByCreatedAt')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((value) => this.handleSortByCreatedAt(value as SelectItem));

    this.sortingForm
      .get('sortByPrice')
      ?.valueChanges.pipe(
        debounceTime(200),
        map((value) => value as SelectItem),
      )
      .subscribe((value) => this.handleSortByPrice(value as SelectItem));
  }

  // Handlers
  protected handleSortByCreatedAt(value: SelectItem) {
    this.sortingForm.get('sortByPrice')?.patchValue(null, { emitEvent: false });
    this.sortingChangeEvent.emit(value.value);
  }

  protected handleSortByPrice(value: SelectItem) {
    this.sortingForm
      .get('sortByCreatedAt')
      ?.patchValue(null, { emitEvent: false });
    this.sortingChangeEvent.emit(value.value);
  }
}
