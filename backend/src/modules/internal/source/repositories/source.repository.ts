import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Source } from '@entities/source.entity';
import { CustomRepository } from '@shared/repositories/custom-repository';

@Injectable()
export class SourceRepository extends CustomRepository<Source> {
  constructor(private readonly dataSource: DataSource) {
    super(Source, dataSource.createEntityManager());
  }

  public async getSourceActiveById(id: number): Promise<Source | null> {
    const qb = this.dataSource
      .getRepository(Source)
      .createQueryBuilder('source')
      .where('source.id = :id', { id })
      .andWhere('source.active = true');
    return await qb.getOne();
  }

  public async getSourceActiveByName(name: string): Promise<Source | null> {
    const qb = this.dataSource
      .getRepository(Source)
      .createQueryBuilder('source')
      .where('source.name = :name', { name })
      .andWhere('source.active = true');
    return await qb.getOne();
  }

  public getLightSources() {
    const query = this.createQueryBuilder('s')
      .select(['s.id', 's.name', 's.active'])
      .andWhere('s.active = true');

    return query.getMany();
  }
}
