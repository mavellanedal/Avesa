import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '@shared/constants/key-decorators.conststat';

export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);
