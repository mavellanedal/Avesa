import { Injectable } from '@nestjs/common';
import { SourceRepository } from '../repositories/source.repository';

@Injectable()
export class SourceService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  public async getSourceActiveById(id: number): Promise<any> {
    return await this.sourceRepository.getSourceActiveById(id);
  }

  public async getSourceActiveByName(name: string): Promise<any> {
    return await this.sourceRepository.getSourceActiveByName(name);
  }
}
