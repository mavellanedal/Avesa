import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExternalApiService } from '../service/external-api.service';
import { LoginDto } from 'src/core/dtos/auth/login.dto';
import { Public } from 'src/modules/auth/decorators/auth.decorator';

@ApiTags('Avesa PropTech')
@Controller('external/api')
export class ExternalApiController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Public()
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtain JWT token with username and password' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  public async validateAndGenerateToken(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    return this.externalApiService.validateAndGenerateToken(
      loginDto.username,
      loginDto.password,
    );
  }
  /*
  @ApiOperation({ summary: 'Insert a lead' })
  @ApiCreatedResponse({ description: ''})
  @ApiBadRequestResponse({ description: ''})
  @ApiConflictResponse({ description: ''})
  @ApiUnauthorizedResponse({ description: ''})
  @ApiInternalServerErrorResponse({ description: ''})
  @ApiBearerAuth()
  @Post('/lead/insert')
  async insertLeadAura(@Body() createLead: CreateLeadDto): Promise<CreateLeadResponseDto> {
      return await this.externalApiService.insertLead(createLead);
  } */
}


/*

  @ApiOperation({summary: 'Insert a lead'})
  @ApiCreatedResponse({description: ApiErrorDescriptions.CREATED('Lead'), type: CreateLeadResponseDto})
  @ApiBadRequestResponse({description: ApiErrorDescriptions.BAD, type: ErrorDto})
  @ApiConflictResponse({description: ApiErrorDescriptions.CONFLICT('Lead'), type: ErrorDto})
  @ApiUnauthorizedResponse({description: ApiErrorDescriptions.UNAUTHORIZED, type: ErrorDto})
  @ApiInternalServerErrorResponse({description: ApiErrorDescriptions.INTERNAL_ERROR, type: ErrorDto})
  @ApiBearerAuth()
  @Post('/lead/insert')
  async insertLeadAura(@Body() createLead: CreateLeadDto): Promise<CreateLeadResponseDto> {
      return await this.externalApiService.insertLead(createLead);
  }
*/
