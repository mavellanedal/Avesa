import { Body, Controller, Post, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExternalApiService } from '@modules/external-api/services/external-api.service';
import { ErrorDto } from '@dtos/common/error.dto';
import { PublicAccess } from '@modules/auth/decorators/auth.decorator';
import { ApiErrorDescriptions } from '@shared/constants/api-errors-descriptions.constants';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { CreateTokenResponseDto } from '@dtos/external-api/create-token-response.dto';
import { CreateLeadResponseDto } from '@dtos/external-api/create-lead-response.dto';
import { CreateLeadDto } from '@dtos/external-api/create-lead.dto';
import { CreatePropertyDto } from '@dtos/external-api/create-property.dto';
import { CreatePropertyResponseDto } from '@dtos/external-api/create-property-response.dto';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/constants/roles.constant';

@ApiTags('Avesa PropTech')
@Controller('/external')
export class ExternalApiController {
  private readonly logger = new Logger(ExternalApiController.name);

  constructor(private readonly externalApiService: ExternalApiService) {}

  @ApiOperation({ summary: 'Create a token for insert leads' })
  @ApiCreatedResponse({
    description: ApiErrorDescriptions.CREATED('Token'),
    type: CreateTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: ApiErrorDescriptions.BAD,
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: ApiErrorDescriptions.UNAUTHORIZED,
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: ApiErrorDescriptions.INTERNAL_ERROR,
    type: ErrorDto,
  })
  @PublicAccess()
  // @UserGuard() --> Esto es para Throttle (por ahora no lo implementamos)
  @Post('/token')
  async createToken(
    @Body() createToken: CreateTokenDto,
  ): Promise<CreateTokenResponseDto> {
    return await this.externalApiService.validateAndGenerateToken(createToken);
  }

  @ApiOperation({ summary: 'Insert a lead to Avesa PropTech' })
  @ApiCreatedResponse({
    description: ApiErrorDescriptions.CREATED('Lead'),
    type: CreateLeadResponseDto,
  })
  @ApiBadRequestResponse({
    description: ApiErrorDescriptions.BAD,
    type: ErrorDto,
  })
  @ApiConflictResponse({
    description: ApiErrorDescriptions.CONFLICT('Lead'),
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: ApiErrorDescriptions.UNAUTHORIZED,
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: ApiErrorDescriptions.INTERNAL_ERROR,
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Roles(ROLES.EXTERNAL_API)
  @Post('/lead/insert')
  async insertLead(
    @Body() createLead: CreateLeadDto,
  ): Promise<CreateLeadResponseDto> {
    return await this.externalApiService.insertLead(createLead);
  }

  @ApiOperation({ summary: 'Insert a property to Avesa PropTech' })
  @ApiCreatedResponse({
    description: ApiErrorDescriptions.CREATED('Property'),
    type: CreatePropertyResponseDto,
  })
  @ApiBadRequestResponse({
    description: ApiErrorDescriptions.BAD,
    type: ErrorDto,
  })
  @ApiConflictResponse({
    description: ApiErrorDescriptions.CONFLICT('Property'),
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: ApiErrorDescriptions.UNAUTHORIZED,
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: ApiErrorDescriptions.INTERNAL_ERROR,
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Roles(ROLES.EXTERNAL_API_PROPERTY_INSERT)
  @Post('/property/insert')
  async insertProperty(
    @Body() createProperty: CreatePropertyDto,
  ): Promise<CreatePropertyResponseDto> {
    return await this.externalApiService.insertProperty(createProperty);
  }
}
