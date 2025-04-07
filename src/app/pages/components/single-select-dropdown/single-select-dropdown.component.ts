import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectItem } from '@app/models';
import {
  BIDV_DEFAULT_MATCHER,
  BidvFilterPipeModule,
  BidvLetModule,
} from '@bidv-ui/cdk';
import {
  BidvDataListComponent,
  BidvDataListModule,
  bidvIsEditingKey,
  BidvPrimitiveTextfieldModule,
} from '@bidv-ui/core';
import { bidvItemsHandlersProvider } from '@bidv-ui/kit';

@Component({
  selector: 'app-single-select-dropdown',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BidvDataListModule,
    BidvPrimitiveTextfieldModule,
    BidvLetModule,
    BidvFilterPipeModule,
  ],
  templateUrl: './single-select-dropdown.component.html',
  styleUrl: './single-select-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectDropdownComponent {
  @Input() items: SelectItem[] = [];

  protected query = '';

  protected readonly filter = BIDV_DEFAULT_MATCHER;

  protected matcher = (item: SelectItem) => `${item.label}`;

  protected onArrowDown(
    list: BidvDataListComponent<string>,
    event: Event,
  ): void {
    list.onFocus(event, true);
  }

  protected onKeyDown(key: string, element: HTMLElement | null): void {
    if (element && bidvIsEditingKey(key)) {
      element.focus({ preventScroll: true });
    }
  }
}
