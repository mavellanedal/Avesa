import { Property } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './service/property.service';
import { PropertyRepository } from './repository/property.repository';
import { PropertyStateHistoryRepository } from './repository/property-state-history.repository';
import { PropertyOwnerRepository } from './repository/property-owner.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [],
  providers: [
    PropertyService,
    PropertyRepository,
    PropertyOwnerRepository,
    PropertyStateHistoryRepository,
  ],
  exports: [
    PropertyService,
    PropertyRepository,
    PropertyOwnerRepository,
    PropertyStateHistoryRepository,
  ],
})
export class PropertyModule {}
