import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { AppUser, LeadState, LeadStateHistory } from '@entities';

@Injectable()
export class LeadStateHistoryRepository extends Repository<LeadStateHistory> {
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
