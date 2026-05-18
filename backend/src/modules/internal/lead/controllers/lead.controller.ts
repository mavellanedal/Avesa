import { Controller, Post, Logger } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ROLES } from '@shared/constants/roles.constant';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { LeadFilterDto } from '@dtos/lead/lead-filter.dto';
import { Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadService } from '@modules/internal/lead/services/lead.service';
import { LeadWelcomeFilterDto } from '@dtos/lead/lead-welcome-filter.dto';
import { LeadWelcomeMetricsDto } from '@dtos/lead/lead-welcome-metrics.dto';
import { LeadChartPointDto } from '@dtos/lead/lead-chart-data.dto';

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

  @Post('/getLeadStateHistory')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeadStateHistory(@Body() { leadId }) {
    return await this.leadService.getLeadStateHistory(leadId);
  }

  @Post('/getLeadStates')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeadStates() {
    return await this.leadService.getLeadStates();
  }

  @Post('/getLeadsWelcome')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeadsWelcome(
    @Body() welcomeLeadFilter: LeadWelcomeFilterDto,
  ): Promise<LeadWelcomeMetricsDto> {
    return await this.leadService.getLeadsWelcome(welcomeLeadFilter);
  }

  @Post('/getLeadsLastMonthByDay')
  @Roles(ROLES.LEADS_READ)
  @HttpCode(HttpStatus.OK)
  async getLeadsLastMonthByDay(): Promise<LeadChartPointDto[]> {
    return await this.leadService.getLeadsLastMonthByDay();
  }
}
