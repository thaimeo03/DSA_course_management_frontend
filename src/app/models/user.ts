import { Role } from '@app/enums/user';
import { DataResponse } from '.';

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
  dateOfBirth?: string;
  avatar?: string;
}
