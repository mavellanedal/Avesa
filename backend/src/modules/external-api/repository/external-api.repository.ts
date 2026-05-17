import { Injectable } from '@nestjs/common';
import { LoginUser } from '@entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ExternalApiRepository {
  private readonly loginUserRepository: Repository<LoginUser>;
  constructor(private readonly dataSource: DataSource) {
    this.loginUserRepository = this.dataSource.getRepository(LoginUser);
  }

  async findLoginUserByUsername(username: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { username },
      relations: ['appUser', 'roles'],
    });
  }
}
