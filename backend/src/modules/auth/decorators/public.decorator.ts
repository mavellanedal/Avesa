import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@shared/constants/key-decorators.conststat';

export const PublicAccess = () => SetMetadata(IS_PUBLIC_KEY, true);
