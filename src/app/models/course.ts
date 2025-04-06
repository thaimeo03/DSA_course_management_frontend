import { CourseSortBy } from '@app/enums/course';
import { DataResponse, DataResponseWithPagination, PaginationParams } from '.';
import { Order } from '@app/enums';

// Detail course
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

export type GetDetailCourseResponse = DataResponse<DetailCourseData>;

// Active courses
export interface GetActiveCourseParams extends PaginationParams {
  sortBy?: CourseSortBy;
  order?: Order;
}

export type GetActiveCourseResponse = DataResponseWithPagination<CourseData[]>;

// Is purchased course
export type IsPurchasedCourseResponse = DataResponse<boolean>;

// Get purchased courses
export type GetPurchasedCoursesParams = GetActiveCourseParams;
export type GetPurchasedCoursesResponse = DataResponseWithPagination<
  CourseData[]
>;

// Get all courses
export type GetAllCoursesParams = GetActiveCourseParams;
export type GetAllCoursesResponse = DataResponseWithPagination<CourseData[]>;

// Create course
export interface CreateCourseBody {
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
}

export type CreateCourseResponse = DataResponse<CourseData>;

// Update course
export interface UpdateCourseBody extends Partial<CreateCourseBody> {}

export type UpdateCourseResponse = DataResponse<CourseData>;
