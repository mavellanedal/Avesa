import { PropertyStateHistory } from '@entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyStateHistoryRepository extends CustomRepository<PropertyStateHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(PropertyStateHistory, dataSource.createEntityManager());
  }
}
