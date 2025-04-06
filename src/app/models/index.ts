import { Params, UrlTree } from '@angular/router';

// Common model
export interface SelectItem {
  label: string;
  value: any;
}

export interface LinkItem {
  label: string;
  link?: string | any[] | UrlTree | undefined;
  queryParams?: Params | null;
}

export interface DocumentItem {
  label: string;
  link: string;
  iconSrc?: string;
}

export interface BadgeItem {
  label: string;
  value: any;
  icon?: string;
  class?: string;
}

// Message for response success or error
export interface MessageResponse {
  message: string | string[];
}

// Data success response
export interface DataResponse<T> extends MessageResponse {
  data: T;
}

// Pagination
export interface IPagination {
  limit: number;
  currentPage: number;
  totalPage: number;
  totalElements: number;
}

export interface DataResponseWithPagination<T> extends DataResponse<T> {
  pagination: IPagination;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
