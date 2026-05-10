import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LeadController } from './controllers/lead.controller';
import { LeadService } from './services/lead.service';
import { LeadRepository } from './repositories/lead.repository';
import { Lead, LeadState, LeadStateHistory } from '@entities';
import { LeadStateHistoryRepository } from './repositories/lead-state-history.repository';
import leadConfig from './config/lead.config';
import { ExternalApiModule } from '@modules/external-api/external-api.module';
import { BlackListModule } from '@modules/general/black-list/black-list.module';
import { LeadStateRepository } from '@modules/internal/lead/repositories/lead-state.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, LeadStateHistory, LeadState]),
    forwardRef(() => ExternalApiModule),
    BlackListModule,
    ConfigModule.forFeature(leadConfig),
  ],
  controllers: [LeadController],
  providers: [
    LeadService,
    LeadRepository,
    LeadStateHistoryRepository,
    LeadStateRepository,
  ],
  exports: [LeadService, LeadRepository],
})
export class LeadModule {}
