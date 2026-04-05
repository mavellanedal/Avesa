import { Module } from '@nestjs/common';
import { BlackListService } from './services/black-list.service';
import { BlackListRepository } from './repository/black-list.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [BlackListService, BlackListRepository],
  exports: [BlackListService],
})
export class BlackListModule {}
