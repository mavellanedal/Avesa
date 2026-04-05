import { registerAs } from '@nestjs/config';

export default registerAs('lead', () => ({
  duplicateInterval: process.env.LD_DUPLICATE_INTERVAL || 'H24',
  duplicateResendInterval: process.env.LD_DUPLICATE_RESEND_INTERVAL || 'M1',
  duplicateWithoutOriginInterval:
    process.env.LD_DUPLICATE_WITHOUT_ORIGIN_INTERVAL || 'M6',
}));
