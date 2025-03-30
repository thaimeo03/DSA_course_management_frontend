import { Role } from '@app/enums/user';

export const ROLES: Record<Role, string> = {
  [Role.Student]: 'Học viên',
  [Role.Admin]: 'Quản trị viên',
  [Role.Banned]: 'Bị cấm',
} as const;
