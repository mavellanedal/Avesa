import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from '@entities/source.entity';
import { SourceController } from '@modules/internal/source/controllers/source.controller';
import { SourceService } from '@modules/internal/source/services/source.service';
import { SourceRepository } from '@modules/internal/source/repositories/source.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  exports: [SourceService, SourceRepository],
})
export class SourceModule {}
