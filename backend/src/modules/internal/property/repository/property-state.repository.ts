import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { LeadState, PropertyState } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class PropertyStateRepository extends CustomRepository<PropertyState> {
  constructor(private readonly dataSource: DataSource) {
    super(PropertyState, dataSource.createEntityManager());
  }

  public getPropertyStates() {
    return this.createQueryBuilder('ps')
      .orderBy('ps.id', 'ASC')
      .getMany();
  }
}
