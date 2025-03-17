import { CourseSortBy } from '@app/enums/course';
import { DataResponseWithPagination, PaginationParams } from '.';
import { Order } from '@app/enums';

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

export interface GetActiveCourseParams extends PaginationParams {
  sortBy?: CourseSortBy;
  order?: Order;
}

export type GetActiveCourseResponse = DataResponseWithPagination<CourseData[]>;
