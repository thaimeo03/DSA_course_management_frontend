import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BidvDataListWrapperModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import { SelectItem } from 'src/app/models';

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
  protected sortByCreatedAts: SelectItem[] = [
    {
      label: 'Newest',
      value: {
        field: 'createdAt',
        order: 'desc',
      },
    },
    {
      label: 'Oldest',
      value: {
        field: 'createdAt',
        order: 'asc',
      },
    },
  ];

  protected sortByPrices: SelectItem[] = [
    {
      label: 'Price: Low to high',
      value: {
        field: 'price',
        order: 'asc',
      },
    },
    {
      label: 'Price: High to low',
      value: {
        field: 'price',
        order: 'desc',
      },
    },
  ];

  protected sortingForm = new FormGroup({
    sortByCreatedAt: new FormControl(this.sortByCreatedAts[0]),
    sortByPrice: new FormControl(null),
  });
}
