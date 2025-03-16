import { Role } from '@app/enums/user';

export const ROLES: Record<Role, string> = {
  [Role.Student]: 'Student',
  [Role.Admin]: 'Admin',
  [Role.Banned]: 'Banned',
} as const;
