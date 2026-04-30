import { PropertyOwner } from '@entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyOwnerRepository extends CustomRepository<PropertyOwner> {
  constructor(private readonly dataSource: DataSource) {
    super(PropertyOwner, dataSource.createEntityManager());
  }
}
