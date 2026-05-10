import { Injectable } from '@nestjs/common';
import { SourceRepository } from '../repositories/source.repository';
import { SourceDto } from '@dtos/source/source.dto';
import { plainToInstance } from 'class-transformer';
import { Source } from '@entities';

@Injectable()
export class SourceService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  public async getSourceActiveById(id: number): Promise<any> {
    return await this.sourceRepository.getSourceActiveById(id);
  }

  public async getSourceActiveByName(name: string): Promise<any> {
    return await this.sourceRepository.getSourceActiveByName(name);
  }

  public async getLightSources(): Promise<SourceDto[]> {
    const sources = await this.sourceRepository.getLightSources();
    return plainToInstance(SourceDto, sources, {
      strategy: 'excludeAll',
    });

  }
}
