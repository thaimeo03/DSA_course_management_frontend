import { DataResponse } from '.';

export interface LectureQueryParams {
  no: number;
}

export type GetActiveLecturesResponse = DataResponse<LectureData[]>;
export type GetAllLecturesResponse = DataResponse<LectureData[]>;

export interface LectureData {
  id: string;
  no: number;
  title: string;
  content: string | null;
  videoUrl: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
