import { HttpStatus, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { CreateTokenResponseDto } from '@dtos/external-api/create-token-response.dto';
import { CreateLeadDto } from '@dtos/external-api/create-lead.dto';
import { CreateLeadResponseDto } from '@dtos/external-api/create-lead-response.dto';
import { ClsService } from 'nestjs-cls';
import { SourceService } from '@modules/internal/source/services/source.service';
import {
  ExternalApiErrors,
  ExternalApiException,
} from '@modules/external-api/exceptions/externa-api.exception';
import { plainToInstance } from 'class-transformer';
import { Lead, Property, PropertyOwner } from '@entities';
import { Source } from '@entities';
import { LeadService } from '@modules/internal/lead/services/lead.service';
import { QualityErrors } from '@modules/internal/lead/exceptions/lead.exceptions';
import { CreatePropertyResponseDto } from '@dtos/external-api/create-property-response.dto';
import { CreatePropertyDto } from '@dtos/external-api/create-property.dto';
import { PropertyService } from '@modules/internal/property/service/property.service';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  private qualityChecks = {
    [QualityErrors.DUPLICATE]: (l: Lead) => ({
      message: 'Lead duplicado: ' + (l.phone ?? ''),
      error: ExternalApiErrors.DUPLICATE_LEAD,
      status: HttpStatus.CONFLICT,
    }),
    [QualityErrors.PHONE_NOT_VALID]: (l: Lead) => ({
      message: 'Lead phone not valid: ' + (l.phone ?? ''),
      error: ExternalApiErrors.PHONE_NOT_VALID,
    }),
    [QualityErrors.PHONE_IN_BLACKLIST]: (l: Lead) => ({
      message: 'Lead phone in blackList: ' + (l.phone ?? ''),
      error: ExternalApiErrors.PHONE_IN_BLACK_LIST,
    }),
    [QualityErrors.EMAIL_IN_BLACKLIST]: (l: Lead) => ({
      message: 'Lead email in blackList: ' + (l.email ?? ''),
      error: ExternalApiErrors.EMAIL_IN_BLACK_LIST,
    }),
  };

  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
    private readonly sourceService: SourceService,
    private readonly leadService: LeadService,
    private readonly propertyService: PropertyService,
  ) {}

  public async validateAndGenerateToken(
    createTokenDto: CreateTokenDto,
  ): Promise<CreateTokenResponseDto> {
    const authResult = await this.authService.createToken(createTokenDto);
    return {
      token: authResult.token,
    };
  }

  public async insertLead(
    createLead: CreateLeadDto,
  ): Promise<CreateLeadResponseDto> {
    try {
      const sourceId: number = this.clsService.get('userToken')?.sourceId;
      let source: Source = null;

      if (!sourceId) {
        if (!createLead.source) {
          throw new ExternalApiException(ExternalApiErrors.SOURCE_NOT_FOUND);
        }
        source = await this.sourceService.getSourceActiveByName(
          createLead.source,
        );
      } else {
        source = await this.sourceService.getSourceActiveById(sourceId);
      }

      if (!source) {
        throw new ExternalApiException(ExternalApiErrors.SOURCE_NOT_FOUND);
      }

      const newLead = plainToInstance(Lead, createLead);
      const lead = await this.leadService.createLead(newLead, source);

      if (!lead) throw new ExternalApiException(ExternalApiErrors.INSERT_LEAD);

      const quality = await this.leadService.checkQuality(lead);

      if (quality.error && this.qualityChecks[quality.error]) {
        const mapped = this.qualityChecks[quality.error](lead);
        this.logger.warn(mapped.message);
        throw new ExternalApiException(mapped.error, mapped.status);
      }

      // if (quality.continueDispatch) {
      //   await this.dispatcherService.dispatchLead(lead);
      // }

      return plainToInstance(CreateLeadResponseDto, lead, {
        strategy: 'excludeAll',
      });
    } catch (error) {
      this.logger.error(error);
      throw error instanceof ExternalApiException
        ? error
        : new ExternalApiException(ExternalApiErrors.INSERT_LEAD);
    }
  }

  public async insertProperty(
    createProperty: CreatePropertyDto,
  ): Promise<CreatePropertyResponseDto> {
    try {
      const owner = plainToInstance(PropertyOwner, createProperty.owner);
      const newProperty = plainToInstance(Property, createProperty);
      newProperty.owner = owner;

      const property = await this.propertyService.createProperty(
        newProperty,
        createProperty.typeId,
      );
      if (!property)
        throw new ExternalApiException(ExternalApiErrors.INSERT_PROPERTY);

      const response = new CreatePropertyResponseDto();
      response.success = true;
      response.message = 'Propiedad insertada con éxito';

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error instanceof ExternalApiException
        ? error
        : new ExternalApiException(ExternalApiErrors.INSERT_PROPERTY);
    }
  }
}

/*
import { HttpStatus } from '@nestjs/common';
import { QualityErrors } from './lead-dispatcher.exception';
import { ExternalApiErrors, ExternalApiException } from './external-api.exception';

public async insertLead(createLead: CreateLeadDto): Promise<CreateLeadResponseDto> {
  try {
    const hasMultiSourceRole = this.cls.get('userToken').roles.includes(ROLES.EXTERNAL_API_MULTI_SOURCE);
    const sourceId: string[] = this.cls.get('userToken').sourceId;

    const needProvider = hasMultiSourceRole || sourceId.length > 1;
    if (needProvider && createLead.provider == null) {
      throw new ExternalApiException(ErrorMessages.isNotEmpty.replace("$property","provider"));
    }

    const platformSource: PlatformSource = new PlatformSource();
    if (createLead.gclid) platformSource.platformId = LEAD_SYSTEM.PLATFORM.GOOGLE;
    else if (createLead.fbclid || createLead.formId) platformSource.platformId = LEAD_SYSTEM.PLATFORM.META;
    else if (createLead.ttclid) platformSource.platformId = LEAD_SYSTEM.PLATFORM.TIKTOK;

    let source: Source = null;
    if (needProvider) source = await this.sourceService.sourceRepository.getSourceActiveByName(createLead.provider);
    else              source = await this.sourceService.sourceRepository.getSourceActiveById(Number(sourceId[0]));
    if (source) platformSource.source = source;
    else {
      this.logger.warn(JSON.stringify(createLead));
      throw new ExternalApiException(ExternalApiErrors.SOURCE_NOT_FOUND);
    }

    const newLead = this.mapper.map(createLead, CreateLeadDto, Lead);
    const lead = await this.leadService.createLead(newLead, platformSource);
    if (!lead) throw new ExternalApiException(ExternalApiErrors.INSERT_LEAD);

    const quality = await this.dispatcherService.checkQuality(lead);

    // Mapeo estilo ejemplo: claves "isDuplicated", "isPhoneNotValid", "isPhoneInBlackList"
    const qualityChecks = {
      isDuplicated: (l: Lead) => ({
        message: 'Lead duplicado: ' + (l.phone1 ?? '') + (l.phone2 ? ', ' + l.phone2 : ''),
        error: ExternalApiErrors.DUPLICATE_LEAD,
        status: HttpStatus.CONFLICT,
      }),
      isPhoneNotValid: (l: Lead) => ({
        message: 'Lead phone not valid: ' + (l.phone1 ?? '') + (l.phone2 ? ', ' + l.phone2 : ''),
        error: ExternalApiErrors.PHONE_NOT_VALID,
        status: HttpStatus.BAD_REQUEST,
      }),
      isPhoneInBlackList: (l: Lead) => ({
        message: 'Lead phone in blackList: ' + (l.phone1 ?? ''),
        error: ExternalApiErrors.PHONE_IN_BLACK_LIST,
        status: HttpStatus.FORBIDDEN,
      }),
      // A propósito NO mapeamos EMAIL_NOT_VALID ni INTERNAL para no lanzar como antes.
    };

    // Puente QualityErrors -> clave del objeto qualityChecks
    const errorToCheckKey: Record<QualityErrors, keyof typeof qualityChecks | undefined> = {
      [QualityErrors.DUPLICATE]: 'isDuplicated',
      [QualityErrors.PHONE_NOT_VALID]: 'isPhoneNotValid',
      [QualityErrors.PHONE_IN_BLACKLIST]: 'isPhoneInBlackList',
      [QualityErrors.EMAIL_NOT_VALID]: undefined,
      [QualityErrors.INTERNAL]: undefined,
    };

    if (quality.error) {
      const key = errorToCheckKey[quality.error];
      if (key && qualityChecks[key]) {
        const mapped = qualityChecks[key](newLead);
        this.logger.warn(mapped.message);
        throw new ExternalApiException(mapped.error, mapped.status);
      }
    }

    if (quality.continueDispatch) {
      await this.dispatcherService.dispatchLead(lead);
    }

    return plainToInstance(CreateLeadResponseDto, lead, { strategy: 'excludeAll' });
  } catch (error) {
    this.logger.error(error);
    throw (error instanceof ExternalApiException) ? error : new ExternalApiException(ExternalApiErrors.INSERT_LEAD);
  }
}





qualityChecks = {
    isDuplicated: (newLead: Lead) => ({
        message: 'Lead duplicado: ' + newLead.phone1 + (newLead.phone2 ? ', ' + newLead.phone2 : ''),
        error: ExternalApiErrors.DUPLICATE_LEAD,
        status: HttpStatus.CONFLICT
    })
};
Pero se puede hacer de la forma más conveniente que se quiera.

Una vez se tenga el mapeo, después de llamar al checkQuality comprobaremos que el error de resultado tenga valor y exista en el mapeo, si es así, se obtiene los datos y se realiza el warn y el throw como ahora.

Esta es la función checkQuality(lead):
public async checkQuality(lead: Lead) {
        const quality = {continueDispatch: true, isDuplicated: false, isPhoneNotValid: false, isPhoneInBlackList: false};

        try {
            if (!Util.isValidPhone(lead.phone1)) {
                if (lead.phone2 && Util.isValidPhone(lead.phone2)) {
                    lead.phone1 = lead.phone2;
                    lead.phone2 = undefined;
                } else {
                    lead.process = LEAD_SYSTEM.LEAD_PROCESS.INCORRECT;
                    await this.leadService.createLeadStateHistory(lead, new Date(), LEAD_SYSTEM.LEAD_STATE.INTERESTED, LEAD_SYSTEM.LEAD_STATE.SUB_STATES.LEAD_NOT_VALID);
                    quality.isPhoneNotValid = true;
                    return quality;
                }
            } else if (lead.phone2 && !Util.isValidPhone(lead.phone2)) {
                lead.phone2 = undefined;
            }

            if (await this.blackListService.isPhoneInBlackList(lead.phone1)) {
                lead.process = LEAD_SYSTEM.LEAD_PROCESS.BLACK_LIST;
                await this.leadService.createLeadStateHistory(lead, new Date(), LEAD_SYSTEM.LEAD_STATE.INTERESTED, LEAD_SYSTEM.LEAD_STATE.SUB_STATES.LEAD_NOT_VALID);
                quality.isPhoneInBlackList = true;
                return quality;
            } else if (lead.phone2 && await this.blackListService.isPhoneInBlackList(lead.phone2)) {
                lead.phone2 = undefined;
            }

            if (!Util.isValidEmail(lead.email)) {
                lead.process = LEAD_SYSTEM.LEAD_PROCESS.INCORRECT;
                await this.leadService.createLeadStateHistory(lead, new Date(), LEAD_SYSTEM.LEAD_STATE.INTERESTED, LEAD_SYSTEM.LEAD_STATE.SUB_STATES.LEAD_NOT_VALID);

            }


            const duplicateLead = await this.leadService.leadRepository.getLastLeadByPhone(lead.phone1, lead.phone2, [lead.id], lead.product.id);
            if (duplicateLead) {
                if (duplicateLead.inceptionDate.getTime() > Util.getDateLastX(this.configLeadDispatcher.duplicateWithoutOriginInterval).getTime()) {
                    if (duplicateLead.inceptionDate.getTime() > Util.getDateLastX(this.configLeadDispatcher.duplicateInterval).getTime()) {
                        await this.leadService.createLeadStateHistory(lead, new Date(), LEAD_SYSTEM.LEAD_STATE.INTERESTED, LEAD_SYSTEM.LEAD_STATE.SUB_STATES.DUPLICATE);
                        await this.leadService.createLeadReference(lead, duplicateLead);
                        quality.isDuplicated = true;
                        quality.continueDispatch = false;
                    } else if (duplicateLead.inceptionDate.getTime() <= Util.getDateLastX(this.configLeadDispatcher.duplicateInterval).getTime() &&
                        duplicateLead.inceptionDate.getTime() > Util.getDateLastX(this.configLeadDispatcher.duplicateResendInterval).getTime()) {
                        const destination = await this.destinationService.destinationRepository.getDestinationByLead(duplicateLead.id);

                        if (destination?.active == true) {
                            const currentTimeZone = await this.leadDispatcherService.timeZoneRepository.getCurrentTimeZone();
                            this.logger.log(`${lead.leadCode} - Se reenvia a - ${destination.id}`);
                            quality.continueDispatch = false;
                            lead.process = LEAD_SYSTEM.LEAD_PROCESS.RESENT;
                            this.retrySendLeadContactCenter(true, destination.id, [destination.id], currentTimeZone.id, lead, false, 0);
                        }
                    } else if (duplicateLead.inceptionDate.getTime() <= Util.getDateLastX(this.configLeadDispatcher.duplicateResendInterval).getTime() &&
                        duplicateLead.inceptionDate.getTime() > Util.getDateLastX(this.configLeadDispatcher.duplicateWithoutOriginInterval).getTime()) {
                        const destination = await this.destinationService.destinationRepository.getDestinationByLead(duplicateLead.id);
                        this.logger.log(`${lead.leadCode} - Se reenvia a destino diferente de - ${destination.id}`);
                        lead.differentDestinationId = destination.id;
                        lead.process = LEAD_SYSTEM.LEAD_PROCESS.RESENT_DIFF_DEST;
                    }
                }
            }
        } catch (error) {
            quality.continueDispatch = false;
            this.logger.error(`${lead.leadCode} - Hubo un error en el quality`, error);
        }

        return quality;
    }
Esta es la funcion insertLead():
 public async insertLead(createLead: CreateLeadDto): Promise<CreateLeadResponseDto> {
        try {
            const hasMultiSourceRole = this.cls.get('userToken').roles.includes(ROLES.EXTERNAL_API_MULTI_SOURCE);
            const sourceId: string[] = this.cls.get('userToken').sourceId;

            const needProvider = hasMultiSourceRole || sourceId.length > 1;
            if (needProvider && createLead.provider == null) {
                throw new ExternalApiException(ErrorMessages.isNotEmpty.replace("$property","provider"));
            }

            const platformSource: PlatformSource = new PlatformSource();
            if (createLead.gclid) {
                platformSource.platformId = LEAD_SYSTEM.PLATFORM.GOOGLE;
            } else if (createLead.fbclid ||createLead.formId) {
                platformSource.platformId = LEAD_SYSTEM.PLATFORM.META;
            } else if (createLead.ttclid) {
                platformSource.platformId = LEAD_SYSTEM.PLATFORM.TIKTOK;
            }

            let source: Source = null;
            if (needProvider) {
                source = await this.sourceService.sourceRepository.getSourceActiveByName(createLead.provider);
            } else {
                source = await this.sourceService.sourceRepository.getSourceActiveById(Number(sourceId[0]))
            }

            if (source) {
                platformSource.source = source;
            } else {
                this.logger.warn(JSON.stringify(createLead));
                throw new ExternalApiException(ExternalApiErrors.SOURCE_NOT_FOUND);
            }

            const newLead = this.mapper.map(createLead, CreateLeadDto, Lead);

            const lead = await this.leadService.createLead(newLead, platformSource);

            const quality = await this.dispatcherService.checkQuality(lead);

            if (!lead) {
                throw new ExternalApiException(ExternalApiErrors.INSERT_LEAD);
            } else if (quality.isPhoneNotValid) {
                this.logger.warn('Lead phone not valid: ' + newLead.phone1 + (newLead.phone2 ? ', ' + newLead.phone2: ''));
                throw new ExternalApiException(ExternalApiErrors.PHONE_NOT_VALID);
            } else if (quality.isPhoneInBlackList) {
                this.logger.warn('Lead phone in blackList: ' + newLead.phone1);
                throw new ExternalApiException(ExternalApiErrors.PHONE_IN_BLACK_LIST);
            } else if (quality.isDuplicated) {
                this.logger.warn('Lead duplicado: ' + newLead.phone1 + (newLead.phone2 ? ', ' + newLead.phone2: ''));
                throw new ExternalApiException(ExternalApiErrors.DUPLICATE_LEAD, HttpStatus.CONFLICT);
            }

            //LeadDispatcher
            if (quality.continueDispatch) {
                await this.dispatcherService.dispatchLead(lead);
            }

            return plainToInstance(CreateLeadResponseDto, lead, {strategy: 'excludeAll'});
        } catch (error) {
            this.logger.error(error);
            throw (error instanceof ExternalApiException) ? error : new ExternalApiException(ExternalApiErrors.INSERT_LEAD)
        }
    }

Separa los bloques de código por archivos:
dispatcher.services.ts --> funcion checkQuality(lead)
lead-dispatcher.exception.ts --> enum QualityErrors
external-api.service.ts --> insertLead()


*/
