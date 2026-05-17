import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { CreateTokenResponseDto } from '@dtos/external-api/create-token-response.dto';
import { CreateLeadDto } from '@dtos/external-api/create-lead.dto';
import { CreateLeadResponseDto } from '@dtos/external-api/create-lead-response.dto';
import { ClsService } from 'nestjs-cls';
import { SourceService } from '@modules/internal/source/services/source.service';
import { ExternalApiErrors, ExternalApiException, } from '@modules/external-api/exceptions/externa-api.exception';
import { plainToInstance } from 'class-transformer';
import { Lead, Property, PropertyOwner, Source } from '@entities';
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
      status: HttpStatus.BAD_REQUEST,
    }),
    [QualityErrors.PHONE_IN_BLACKLIST]: (l: Lead) => ({
      message: 'Lead phone in blackList: ' + (l.phone ?? ''),
      error: ExternalApiErrors.PHONE_IN_BLACK_LIST,
      status: HttpStatus.FORBIDDEN,
    }),
    [QualityErrors.EMAIL_IN_BLACKLIST]: (l: Lead) => ({
      message: 'Lead email in blackList: ' + (l.email ?? ''),
      error: ExternalApiErrors.EMAIL_IN_BLACK_LIST,
      status: HttpStatus.FORBIDDEN,
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
    try {
      const authResult = await this.authService.createToken(createTokenDto);
      return {
        token: authResult.token,
      };
    } catch (error) {
      this.logger.error('Error generando token externo', error);
      throw new ExternalApiException(
        ExternalApiErrors.USER_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }
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
      const newProperty = plainToInstance(Property, createProperty);
      if (createProperty.owner) {
        newProperty.owner = plainToInstance(
          PropertyOwner,
          createProperty.owner,
        );
      }

      const property = await this.propertyService.createProperty(
        newProperty,
        createProperty.typeId,
      );
      if (!property)
        throw new ExternalApiException(ExternalApiErrors.INSERT_PROPERTY);

      return plainToInstance(CreatePropertyResponseDto, property, {
        strategy: 'excludeAll',
      });
    } catch (error) {
      this.logger.error(error);
      throw error instanceof ExternalApiException
        ? error
        : new ExternalApiException(ExternalApiErrors.INSERT_PROPERTY);
    }
  }
}
