import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { LeadStateHistory } from '@entities';

@Injectable()
export class LeadStateHistoryRepository extends Repository<LeadStateHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(LeadStateHistory, dataSource.createEntityManager());
  }
}
