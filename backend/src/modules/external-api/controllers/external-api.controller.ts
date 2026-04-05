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
  @Post('/lead/insert')
  async insertLead(
    @Body() createLead: CreateLeadDto,
  ): Promise<CreateLeadResponseDto> {
    return await this.externalApiService.insertLead(createLead);
  }
}
