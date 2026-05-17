import { Property } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './service/property.service';
import { PropertyController } from './controller/property.controller';
import { PropertyRepository } from './repository/property.repository';
import { PropertyStateHistoryRepository } from './repository/property-state-history.repository';
import { PropertyOwnerRepository } from './repository/property-owner.repository';
import { PropertyStateRepository } from '@modules/internal/property/repository/property-state.repository';
import { PropertyTypeRepository } from '@modules/internal/property/repository/property-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    PropertyRepository,
    PropertyOwnerRepository,
    PropertyStateHistoryRepository,
    PropertyStateRepository,
    PropertyTypeRepository,
  ],
  exports: [
    PropertyService,
    PropertyRepository,
    PropertyOwnerRepository,
    PropertyStateHistoryRepository,
  ],
})
export class PropertyModule {}
