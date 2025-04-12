import { Difficulty, SortBy } from '@app/enums/problem';
import { SubmissionStatus } from '@app/enums/submission';
import { DataResponse, DataResponseWithPagination, PaginationParams } from '.';
import { Order } from '@app/enums';

// Get problems
export type ProblemRepositoryResponse = DataResponseWithPagination<
  ProblemRepositoryData[]
>;

export interface ProblemRepositoryData {
  id: string;
  title: string;
  content: string;
  point: number;
  difficulty: Difficulty;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  status: SubmissionStatus;
}

export interface GetProblemRepositoryParams extends PaginationParams {
  sortBy?: SortBy;
  order?: Order;
  search?: string;
}

// Create problem
export interface CreateProblemBody {
  title: string;
  content: string;
  point: number;
  difficulty: Difficulty;
  courseId: string;
}

export type CreateProblemResponse = DataResponse<ProblemRepositoryData>;

// Update
export interface UpdateProblemBody
  extends Partial<Omit<CreateProblemBody, 'courseId'>> {}
