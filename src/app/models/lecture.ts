import { L } from 'node_modules/@bidv-api/core/build/modern/types-BYziPhrv';
import { DataResponse } from '.';

export interface LectureQueryParams {
  no: number;
}

// Get all and active lectures
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

// Create lesson
export interface CreateLectureBody {
  courseId: string;
  no: number;
  title: string;
  content?: string;
  videoUrl: string;
}

export type CreateLectureResponse = DataResponse<LectureData>;

// Lesson detail
export type GetLectureDetailResponse = DataResponse<LectureData>;
