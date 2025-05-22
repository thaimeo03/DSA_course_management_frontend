import { Role } from '@app/enums/user';
import { DataResponse, DataResponseWithPagination, PaginationParams } from '.';

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MeData {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phoneNumber: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  verified: boolean;
}

export type GetMeResponse = DataResponse<MeData>;

// Update profile
export interface UpdateProfileBody {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  avatar?: string;
}

// Get ranks
export interface GetRanksParams extends PaginationParams {}

export type GetRanksResponse = DataResponseWithPagination<RankData[]>;

export interface RankData {
  rank: number;
  user: UserRankData;
  score: number;
}

export interface UserRankData {
  id: string;
  fullName: string;
  avatar: string | null;
}

// Get accounts
export interface GetAccountsParams extends PaginationParams {
  search?: string; // search by email or full name
}

export type GetAccountsResponse = DataResponseWithPagination<AccountData[]>;

export interface AccountData extends MeData {
  createdAt: string;
  updatedAt: string;
}
