import { Property } from '@entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyRepository extends CustomRepository<Property> {
  constructor(private readonly dataSource: DataSource) {
    super(Property, dataSource.createEntityManager());
  }
}
