import { Injectable, Logger, Inject } from '@nestjs/common';
import { Util } from '@shared/utilities/util';
import { nanoid } from 'nanoid';
import { LEAD_SYSTEM } from '@shared/constants/lead-system.constant';
import { LeadRepository } from '@modules/internal/lead/repositories/lead.repository';
import { LeadStateHistoryRepository } from '@modules/internal/lead/repositories/lead-state-history.repository';
import { Source, Lead, LeadStateHistory, LeadState, AppUser } from '@entities';
import { QualityErrors } from '../exceptions/lead.exceptions';
import { BlackListService } from '@modules/general/black-list/services/black-list.service';
import leadConfig from '@modules/internal/lead/config/lead.config';
import { ConfigType } from '@nestjs/config';
import { LeadFilterDto } from '@dtos/lead/lead-filter.dto';
import { LeadWelcomeFilterDto } from '@dtos/lead/lead-welcome-filter.dto';
import { ResponseDataDto } from '@dtos/common/response-data.dto';
import { plainToInstance } from 'class-transformer';
import { LeadDto } from '@dtos/lead/lead.dto';
import { LeadStateHistoryDto } from '@dtos/lead/lead-state-history.dto';
import { LeadStateDto } from '@dtos/lead/lead-state.dto';
import { LeadStateRepository } from '@modules/internal/lead/repositories/lead-state.repository';

export interface IQuality {
  isQualified: boolean;
  error?: QualityErrors;
  isDuplicated?: boolean;
}

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly leadStateHistoryRepository: LeadStateHistoryRepository,
    private readonly blackListService: BlackListService,
    @Inject(leadConfig.KEY)
    private readonly configLead: ConfigType<typeof leadConfig>,
    private readonly leadStateRepository: LeadStateRepository,
  ) {}

  public async createLead(
    newLead: Lead,
    source: Source | null,
  ): Promise<Lead | null> {
    return Util.transactional(async () => {
      const code = nanoid(LEAD_SYSTEM.NANOID_MAX_LENGTH);
      newLead.code = code;
      newLead.source = source;
      const date = new Date();
      newLead.createdAt = date;
      const result = await this.leadRepository.insert(newLead);
      newLead.id = result.generatedMaps[0]?.id as string;
      await this.createLeadStateHistory(
        newLead,
        date,
        LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
      );
      return newLead;
    }).catch((error) => {
      this.logger.error('Se ha producido un error al crear el Lead', error);
      return null;
    });
  }

  public async createLeadStateHistory(
    newLead: Lead,
    date: Date,
    state: number,
    subState?: number,
    user?: string,
  ): Promise<void> {
    const newLeadStateHistory = new LeadStateHistory();
    newLeadStateHistory.lead = newLead;
    newLeadStateHistory.changeDate = date;
    newLeadStateHistory.leadState = new LeadState(state);
    if (subState) {
      newLeadStateHistory.leadSubState = new LeadState(subState);
    }
    if (user) {
      newLeadStateHistory.appUser = new AppUser(user);
    }
    await this.leadStateHistoryRepository.insert(newLeadStateHistory);
  }

  public async checkQuality(lead: Lead) {
    const quality: IQuality = { isQualified: true };

    try {
      if (!Util.isValidPhone(lead.phone)) {
        await this.createLeadStateHistory(
          lead,
          new Date(),
          LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
          LEAD_SYSTEM.LEAD_STATE.LEAD_SUB_STATE.INVALID,
        );
        quality.isQualified = false;
        quality.error = QualityErrors.PHONE_NOT_VALID;
        return quality;
      }
      if (await this.blackListService.isPhoneInBlackList(lead.phone)) {
        await this.createLeadStateHistory(
          lead,
          new Date(),
          LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
          LEAD_SYSTEM.LEAD_STATE.LEAD_SUB_STATE.INVALID,
        );
        quality.isQualified = false;
        quality.error = QualityErrors.PHONE_IN_BLACKLIST;
        return quality;
      }

      if (await this.blackListService.isEmailInBlackList(lead.email)) {
        await this.createLeadStateHistory(
          lead,
          new Date(),
          LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
          LEAD_SYSTEM.LEAD_STATE.LEAD_SUB_STATE.INVALID,
        );
        quality.error = QualityErrors.EMAIL_IN_BLACKLIST;
      }

      if (!Util.isValidEmail(lead.email)) {
        await this.createLeadStateHistory(
          lead,
          new Date(),
          LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
          LEAD_SYSTEM.LEAD_STATE.LEAD_SUB_STATE.INCOPRRECT_DATA,
        );
      }

      const duplicatedLead = await this.leadRepository.getLastLeadByPhone(
        lead.phone,
        [lead.id],
      );

      if (duplicatedLead) {
        if (
          duplicatedLead.createdAt.getTime() >
          Util.getDateLastX(
            this.configLead.duplicateWithoutOriginInterval,
          ).getTime()
        ) {
          if (
            duplicatedLead?.createdAt.getTime() >
            Util.getDateLastX(this.configLead.duplicateInterval).getTime()
          ) {
            await this.createLeadStateHistory(
              lead,
              new Date(),
              LEAD_SYSTEM.LEAD_STATE.PHASE_INTERESTED,
              LEAD_SYSTEM.LEAD_STATE.LEAD_SUB_STATE.DUPLICATED,
            );
            quality.isDuplicated = true;
            quality.isQualified = false;
          }
        }
      }
    } catch (error: any) {
      this.logger.error(
        `${lead.code} - Se ha producido un error en el quality`,
        error,
      );
      quality.error = QualityErrors.INTERNAL;
      quality.isQualified = false;
      return quality;
    }
    return quality;
  }

  public async getLeads(leadFilter: LeadFilterDto) {
    const [leads, total] =
      await this.leadRepository.getLeadsByFilter(leadFilter);
    return new ResponseDataDto(
      plainToInstance(LeadDto, <Lead[]>leads, { strategy: 'excludeAll' }),
      <number>total,
    );
  }

  public async getLeadStateHistory(
    idLead: string,
  ): Promise<LeadStateHistoryDto[]> {
    const leadStateHistories =
      await this.leadStateHistoryRepository.getLeadStateHistory(idLead);
    return plainToInstance(LeadStateHistoryDto, leadStateHistories, {
      strategy: 'excludeAll',
    });
  }

  public async getLeadStates(): Promise<LeadStateDto[]> {
    const leadStates = await this.leadStateRepository.getLeadStates();
    return plainToInstance(LeadStateDto, leadStates, {
      strategy: 'excludeAll',
    });
  }

  public async getLeadsWelcome(welcomeLeadFilter: LeadWelcomeFilterDto) {
    return await this.leadRepository.getLeadsWelcome(welcomeLeadFilter);
  }

  public async getLeadsLastMonthByDay() {
    return this.leadRepository.getLeadsLastMonthByDay();
  }
}
