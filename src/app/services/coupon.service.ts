import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageResponse } from '@app/models';
import {
  ApplyCouponBody,
  CreateCouponBody,
  CreateCouponResponse,
  GetAllCouponsParams,
  GetAllCouponsResponse,
  GetCouponDetailResponse,
  UpdateCouponBody,
} from '@app/models/coupon';
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

  getCouponDetail(id: string) {
    return this.#httpClient.get<GetCouponDetailResponse>(`/coupons/${id}`);
  }

  createCoupon(body: CreateCouponBody) {
    return this.#httpClient.post<CreateCouponResponse>('/coupons', body);
  }

  updateCoupon(id: string, body: UpdateCouponBody) {
    return this.#httpClient.patch<MessageResponse>(`/coupons/${id}`, body);
  }

  deleteCoupon(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/coupons/${id}`);
  }

  applyCoupon(body: ApplyCouponBody) {
    return this.#httpClient.post<MessageResponse>('/coupons/apply', body);
  }
}
