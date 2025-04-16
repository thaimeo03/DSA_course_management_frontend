import { CouponType, SortBy } from '@app/enums/coupon';
import { DataResponse, DataResponseWithPagination, PaginationParams } from '.';

// Get all coupons
export interface GetAllCouponsParams extends PaginationParams {
  sortBy?: SortBy;
}

export type GetAllCouponsResponse = DataResponseWithPagination<CouponData[]>;

export interface CouponData {
  id: string;
  type: CouponType;
  code: string;
  amountOff: number | null;
  percentOff: number | null;
  maxRedeem: number | null;
  expiredAt: string | null;
  updatedAt: string;
}

// Create coupon
export interface CreateCouponBody {
  type: CouponType;
  code: string;
  amountOff: number | null;
  percentOff: number | null;
  maxRedeem: number | null;
  expiredAt: string | null;
}

export type CreateCouponResponse = DataResponse<CouponData>;

// Get coupon detail
export type GetCouponDetailResponse = DataResponse<CouponData>;

// Update coupon
export interface UpdateCouponBody extends Partial<CreateCouponBody> {}
