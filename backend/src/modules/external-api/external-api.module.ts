import { Module, forwardRef } from '@nestjs/common';
import { ExternalApiController } from './controllers/external-api.controller';
import { ExternalApiService } from './services/external-api.service';
import { ExternalApiRepository } from './repository/external-api.repository';
import { AuthModule } from '../auth/auth.module';
import { SourceModule } from '@modules/internal/source/source.module';
import { LeadModule } from '@modules/internal/lead/lead.module';
import { PropertyModule } from '@modules/internal/property/property.module';

@Module({
  imports: [
    AuthModule,
    SourceModule,
    forwardRef(() => LeadModule),
    PropertyModule,
  ],
  controllers: [ExternalApiController],
  providers: [ExternalApiService, ExternalApiRepository],
})
export class ExternalApiModule {}
