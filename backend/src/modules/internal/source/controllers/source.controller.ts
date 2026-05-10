import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { Source } from '@entities';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/constants/roles.constant';
import { SourceService } from '@modules/internal/source/services/source.service';

@Controller('source')
export class SourceController {
  private readonly logger = new Logger(SourceController.name);

  constructor(private readonly sourceService: SourceService) {}

  @Post('/getLightSources')
  @Roles(ROLES.SOURCES_READ)
  @HttpCode(HttpStatus.OK)
  async getLightSources() {
    return this.sourceService.getLightSources();
  }
}
