import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetOrderHistoryResponse,
  PayBody,
  PayResponse,
} from '@app/models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  readonly #httpClient = inject(HttpClient);

  pay(body: PayBody) {
    return this.#httpClient.post<PayResponse>('/payments/pay', body);
  }

  getSuccessOrderHistory() {
    return this.#httpClient.get<GetOrderHistoryResponse>(
      '/payments/orders/success',
    );
  }
}
