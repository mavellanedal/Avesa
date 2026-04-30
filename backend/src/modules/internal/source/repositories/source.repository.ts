import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Source } from '@entities/source.entity';

@Injectable()
export class SourceRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getSourceActiveById(id: number): Promise<Source | null> {
    const qb = this.dataSource
      .getRepository(Source)
      .createQueryBuilder('source')
      .where('source.id = :id', { id })
      .andWhere('source.active = 1::bit');
    return await qb.getOne();
  }

  public async getSourceActiveByName(name: string): Promise<Source | null> {
    const qb = this.dataSource
      .getRepository(Source)
      .createQueryBuilder('source')
      .where('source.name = :name', { name })
      .andWhere('source.active = 1::bit');
    return await qb.getOne();
  }

  public async
}
