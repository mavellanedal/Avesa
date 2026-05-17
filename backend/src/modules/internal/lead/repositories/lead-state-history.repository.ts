import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LeadStateHistory } from '@entities';
import { CustomRepository } from '@shared/repositories/custom-repository';

@Injectable()
export class LeadStateHistoryRepository extends CustomRepository<LeadStateHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(LeadStateHistory, dataSource.createEntityManager());
  }

  public getLeadStateHistory(idLead: string) {
    return this.createQueryBuilder('lsh')
      .leftJoinAndSelect('lsh.leadState', 'lsState')
      .leftJoinAndSelect('lsh.leadSubState', 'lsSubState')
      .leftJoinAndSelect('lsh.appUser', 'lsUser')
      .where('lsh.lead_id = :idLead', { idLead })
      .orderBy('lsh.changeDate', 'DESC')
      .getMany();
  }
}
