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
