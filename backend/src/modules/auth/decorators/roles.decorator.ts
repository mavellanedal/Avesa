import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@shared/constants/key-decorators.conststat';
import { ROLES } from '@shared/constants/roles.constant';

export const Roles = (...roles: Array<ROLES>) => SetMetadata(ROLES_KEY, roles);
