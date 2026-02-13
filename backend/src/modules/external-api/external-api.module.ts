import { Module } from '@nestjs/common';
import { ExternalApiController } from './controllers/external-api.controller';
import { ExternalApiService } from './service/external-api.service';
import { ExternalApiRepository } from './repository/external-api.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExternalApiController],
  providers: [ExternalApiService, ExternalApiRepository],
})
export class ExternalApiModule {}
