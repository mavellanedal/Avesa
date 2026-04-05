import { Controller, Post, Logger } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ROLES } from '@shared/constants/roles.constant';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { LeadFilterDto } from '@dtos/lead/lead-filter.dto';
import { Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadService } from '@modules/internal/lead/services/lead.service';
import { LeadWelcomeFilterDto } from '@dtos/lead/lead-welcome-filter.dto';
import { LeadWelcomeMetricsDto } from '@dtos/lead/lead-welcome-metrics.dto';

@ApiExcludeController()
@Controller('lead')
export class LeadController {
  private readonly logger = new Logger(LeadController.name);

  constructor(private readonly leadService: LeadService) {}

  @Post('/getLeads')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeads(@Body() leadFilter: LeadFilterDto) {
    return await this.leadService.getLeads(leadFilter);
  }

  @Post('/getLeadsWelcome')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeadsWelcome(
    @Body() welcomeLeadFilter: LeadWelcomeFilterDto,
  ): Promise<LeadWelcomeMetricsDto> {
    return await this.leadService.getLeadsWelcome(welcomeLeadFilter);
  }
}
