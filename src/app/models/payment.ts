import { PaymentMethod } from '@app/enums/payment';
import { DataResponse } from '.';

export type PayResponse = DataResponse<PayData>;

export interface PayData {
  url: string;
}

export interface PayBody {
  courseId: string;
  method: PaymentMethod;
}
