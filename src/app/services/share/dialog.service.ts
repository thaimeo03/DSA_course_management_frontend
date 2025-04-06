import { inject, Injectable } from '@angular/core';
import { BidvDialogService, BidvDialogStatusOption } from '@bidv-ui/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  #dialogs = inject(BidvDialogService);

  openConfirmDialog(
    context: string,
    options?: Partial<BidvDialogStatusOption>,
  ) {
    return this.#dialogs.success(context, {
      label: 'Xác nhận',
      data: {
        buttonClose: 'Hủy',
        button: 'Xác nhận',
      },
      icon: 'bidvIconWarningOutline',
      customIcon: {
        background: 'var(--background-semantic-notice-subtle)',
        color: 'var(--text-semantic-notice-intermediate)',
      },
      ...options, // Override default options
    });
  }
}
