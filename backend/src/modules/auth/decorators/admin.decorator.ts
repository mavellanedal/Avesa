import { SetMetadata } from '@nestjs/common';
import { GROUPS } from '@shared/constants/groups.constant';
import { ADMIN_KEY } from '@shared/constants/key-decorators.conststat';

export const AdminAccess = () => SetMetadata(ADMIN_KEY, GROUPS.ADMINISTRATOR);
