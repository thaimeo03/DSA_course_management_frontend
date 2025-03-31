import { PaymentMethod } from '@app/enums/payment';
import { DataResponse } from '.';

// Pay
export type PayResponse = DataResponse<PayData>;

export interface PayData {
  url: string;
}

export interface PayBody {
  courseId: string;
  method: PaymentMethod;
  code?: string;
}

// Get order history
export type GetOrderHistoryResponse = DataResponse<GetOrderHistoryData[]>;

interface GetOrderHistoryData {
  id: string;
  totalPrice: number;
  paymentDate: string;
  createdAt: string;
  course: CourseOrderHistory;
}

export interface CourseOrderHistory {
  id: string;
  title: string;
  thumbnail: string;
}
