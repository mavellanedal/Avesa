import { PropertyStateHistory } from '@entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyStateHistoryRepository extends CustomRepository<PropertyStateHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(PropertyStateHistory, dataSource.createEntityManager());
  }
  
  public getPropertyStateHistories(propertyId: string) {
    return this.createQueryBuilder('psh')
      .leftJoinAndSelect('psh.propertyState', 'pshState')
      .leftJoinAndSelect('psh.appUser', 'pshUser')
      .where('psh.property_id = :propertyId', { propertyId })
      .orderBy('psh.changeDate', 'DESC')
      .getMany();
  }
}
