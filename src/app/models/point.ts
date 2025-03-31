import { DataResponse } from '.';

export type GetMyPointResponse = DataResponse<PointData>;

export interface PointData {
  id: string;
  value: number;
  updatedAt: string;
}
