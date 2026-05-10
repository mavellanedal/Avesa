import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { LeadState } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class LeadStateRepository extends CustomRepository<LeadState> {
  constructor(private readonly dataSource: DataSource) {
    super(LeadState, dataSource.createEntityManager());
  }

  public getLeadStates() {
    return this.createQueryBuilder('leadState')
      .leftJoinAndMapOne(
        'leadState.parent',
        LeadState,
        'lsp',
        'leadState.parent_id = lsp.id',
      )
      .orderBy('leadState.id', 'ASC')
      .getMany();
  }
}
