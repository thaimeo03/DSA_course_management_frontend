import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetAllCouponsParams, GetAllCouponsResponse } from '@app/models/coupon';
import { getHttpParams } from '@app/utils/handle-api';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  readonly #httpClient = inject(HttpClient);

  getAllCoupons(params: GetAllCouponsParams) {
    const httpParams = getHttpParams(params);

    return this.#httpClient.get<GetAllCouponsResponse>('/coupons', {
      params: httpParams,
    });
  }
}
