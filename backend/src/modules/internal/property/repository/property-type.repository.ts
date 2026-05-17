import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { PropertyType } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyTypeRepository extends CustomRepository<PropertyType> {
  constructor(private readonly dataSource: DataSource) {
    super(PropertyType, dataSource.createEntityManager());
  }

  public async getPropertyTypes(): Promise<PropertyType[]> {
    return this.createQueryBuilder('pt').orderBy('pt.id', 'ASC').getMany();
  }
}
