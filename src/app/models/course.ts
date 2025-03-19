import { CourseSortBy } from '@app/enums/course';
import { DataResponse, DataResponseWithPagination, PaginationParams } from '.';
import { Order } from '@app/enums';

export interface CourseData {
  id: string;
  title: string;
  videoUrl: string | null;
  description: string | null;
  thumbnail: string;
  price: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DetailCourseData
  extends Omit<CourseData, 'isActive' | 'isArchived'> {}

export interface GetDetailCourseParams {
  isActive: '1' | '0';
}

export interface GetActiveCourseParams extends PaginationParams {
  sortBy?: CourseSortBy;
  order?: Order;
}

export type GetActiveCourseResponse = DataResponseWithPagination<CourseData[]>;
export type GetDetailCourseResponse = DataResponse<DetailCourseData>;
