import { CouponType, SortBy } from '@app/enums/coupon';
import { DataResponseWithPagination, PaginationParams } from '.';

// Get all coupons
export interface GetAllCouponsParams extends PaginationParams {
  sortBy?: SortBy;
}

export type GetAllCouponsResponse = DataResponseWithPagination<CouponData[]>;

interface CouponData {
  id: string;
  type: CouponType;
  code: string;
  amountOff: number | null;
  percentOff: number | null;
  maxRedeem: number | null;
  expiredAt: string | null;
  updatedAt: string;
}
