import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@shared/constants/key-decorators.conststat';
import { ROLES } from '@shared/constants/roles.constant';

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const Roles = (...roles: Array<RoleType>) =>
  SetMetadata(ROLES_KEY, roles);
