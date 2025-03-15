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
  avatar: string | null;
  dateOfBirth: string | null;
  verified: boolean;
}

export type GetMeResponse = DataResponse<MeData>;
