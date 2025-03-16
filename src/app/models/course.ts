import { DataResponse } from '.';

export interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetActiveCourseResponse = DataResponse<CourseData[]>;
