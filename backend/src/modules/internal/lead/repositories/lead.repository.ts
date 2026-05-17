import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Lead, LeadState, LeadStateHistory, Source } from '@entities';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { Brackets } from 'typeorm';
import { LeadFilterDto } from '@dtos/lead/lead-filter.dto';
import { LeadWelcomeFilterDto } from '@dtos/lead/lead-welcome-filter.dto';

@Injectable()
export class LeadRepository extends CustomRepository<Lead> {
  private readonly sortMap = {
    code: 'lead.code',
    name: 'lead.name',
    phone: 'lead.phone',
    email: 'lead.email',
    createdAt: 'lead.createdAt',
    state: 'ls.name',
    subState: 'lss.name',
    source: 'lsrc.name',
  };

  constructor(private readonly dataSource: DataSource) {
    super(Lead, dataSource.createEntityManager());
  }

  public getLastLeadByPhone(
    phone: string,
    ids: string[] | null = null,
  ): Promise<Lead | null> {
    const query = this.createQueryBuilder('lead').where(
      new Brackets((qb) => {
        qb.where('lead.phone = :phone11', { phone11: phone });
      }),
    );
    if (ids) {
      query.andWhere('lead.id not in (:...ids)', { ids });
    }

    query.orderBy('lead.id', 'DESC');

    return query.getOne();
  }

  public async getLeadsByFilter(leadFilter: LeadFilterDto) {
    const qb = this.createQueryBuilder('lead');
    const query = qb
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('MAX(lsh_max.changeDate)', 'max_date')
            .addSelect('lsh_max.lead_id', 'lead_id')
            .from(LeadStateHistory, 'lsh_max')
            .groupBy('lsh_max.lead_id');
        },
        'latest_history',
        'latest_history.lead_id = lead.id',
      )
      .leftJoinAndMapMany(
        'lead.leadStateHistories',
        LeadStateHistory,
        'lsh',
        'lsh.changeDate = latest_history.max_date AND lsh.lead_id = lead.id',
      )
      .leftJoinAndSelect('lsh.leadState', 'ls')
      .leftJoinAndSelect('lsh.leadSubState', 'lss')
      .leftJoinAndSelect('lead.source', 'lsrc');

    if (leadFilter.leadCode) {
      query.andWhere('lead.code = :leadCode', {
        leadCode: leadFilter.leadCode,
      });
    }

    if (leadFilter.phone) {
      query.andWhere('lead.phone = :phone', { phone: leadFilter.phone });
    }

    if (leadFilter.email) {
      query.andWhere('lead.email = :email', { email: leadFilter.email });
    }

    if (leadFilter.name) {
      query.andWhere('lead.name LIKE :name', { name: `%${leadFilter.name}%` });
    }

    if (leadFilter.surname) {
      query.andWhere('lead.surname LIKE :surname', {
        surname: `%${leadFilter.surname}%`,
      });
    }

    if (leadFilter.sourceId) {
      query.andWhere('lsrc.id = :sourceId', {
        sourceId: leadFilter.sourceId,
      });
    }

    if (leadFilter.stateId) {
      query.andWhere('ls.id = :stateId', {
        stateId: leadFilter.stateId,
      });
    }

    if (leadFilter.subStateId) {
      query.andWhere('lss.id = :subStateId', {
        subStateId: leadFilter.subStateId,
      });
    }

    if (leadFilter.startDate) {
      query.andWhere('lead.createdAt >= :startDate', {
        startDate: leadFilter.startDate,
      });
    }

    if (leadFilter.endDate) {
      query.andWhere('lead.createdAt <= :endDate', {
        endDate: leadFilter.endDate,
      });
    }

    query.limit(leadFilter.maxResult);
    query.orderBy(
      this.sortMap[leadFilter.sortBy] || 'lead.createdAt',
      leadFilter.orderBy || 'DESC',
    );
    return this.paginateResults(
      await query.getMany(),
      leadFilter.first,
      leadFilter.max,
      leadFilter.maxResult,
      true,
    );
  }

  public async getLeadsWelcome(welcomeLeadFilter: LeadWelcomeFilterDto) {
    const newLeadsPromise = this.createQueryBuilder('lead')
      .where('lead.createdAt >= :startDate', {
        startDate: welcomeLeadFilter.startDate,
      })
      .andWhere('lead.createdAt <= :endDate', {
        endDate: welcomeLeadFilter.endDate,
      })
      .getCount();

    const joinLatestState = (qb) => {
      return qb
        .innerJoin(
          (subQuery) => {
            return subQuery
              .select('MAX(lsh_max.changeDate)', 'max_date')
              .addSelect('lsh_max.lead_id', 'lead_id')
              .from(LeadStateHistory, 'lsh_max')
              .groupBy('lsh_max.lead_id');
          },
          'latest_history',
          'latest_history.lead_id = lead.id',
        )
        .innerJoin(
          'lead.leadStateHistories',
          'lsh',
          'lsh.changeDate = latest_history.max_date AND lsh.lead_id = lead.id',
        )
        .innerJoin('lsh.leadState', 'state')
        .leftJoin('state.parent', 'parentState');
    };

    const qbHotLeads = this.createQueryBuilder('lead');

    const hotLeadsPromise = joinLatestState(qbHotLeads)
      .where('lead.aiScore > 80')
      .andWhere('state.name != :sqlPhase', { sqlPhase: 'PHASE_SQL' })
      .andWhere('(parentState.name IS NULL OR parentState.name != :sqlPhase)', {
        sqlPhase: 'PHASE_SQL',
      })
      .getCount();

    const qbClients = this.createQueryBuilder('lead');
    const clientsPromise = joinLatestState(qbClients)
      .where("state.name = 'PHASE_CLIENT' OR parentState.name = 'PHASE_CLIENT'")
      .getCount();

    const totalLeadsPromise = this.createQueryBuilder('lead').getCount();

    const topLeadsPromise = this.createQueryBuilder('lead')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('MAX(lsh_max.changeDate)', 'max_date')
            .addSelect('lsh_max.lead_id', 'lead_id')
            .from(LeadStateHistory, 'lsh_max')
            .groupBy('lsh_max.lead_id'),
        'latest_history',
        'latest_history.lead_id = lead.id',
      )
      .innerJoin(
        'lead.leadStateHistories',
        'lsh',
        'lsh.changeDate = latest_history.max_date AND lsh.lead_id = lead.id',
      )
      .innerJoinAndMapOne('lead.currentState', 'lsh.leadState', 'state')
      .orderBy('lead.aiScore', 'DESC')
      .take(4)
      .getMany();

    const [newLeadsToday, hotLeadsNotSql, totalClients, totalLeads, topLeads] =
      await Promise.all([
        newLeadsPromise,
        hotLeadsPromise,
        clientsPromise,
        totalLeadsPromise,
        topLeadsPromise,
      ]);

    const conversionRate =
      totalLeads === 0
        ? 0
        : parseFloat(((totalClients / totalLeads) * 100).toFixed(2));

    return {
      newLeadsToday,
      hotLeadsNotSql,
      conversionRate,
      topLeads,
    };
  }
}
