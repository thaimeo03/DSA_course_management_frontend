// Common model
export interface SelectItem {
  label: string;
  value: any;
}

export interface LinkItem {
  label: string;
  link: string;
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
  current_page: number;
  total_page: number;
}

export interface DataResponseWithPagination<T> extends DataResponse<T> {
  pagination: IPagination;
}
