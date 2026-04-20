import { Controller, Post, Logger } from '@nestjs/common';
import { Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ROLES } from '@shared/constants/roles.constant';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { PropertyService } from '../service/property.service';
import { PropertyFilterDto } from '@dtos/property/property-filter.dto';

@ApiExcludeController()
@Controller('property')
export class PropertyController {
  private readonly logger = new Logger(PropertyController.name);

  constructor(private readonly propertyService: PropertyService) {}

  @Post('/getProperties')
  @Roles(ROLES.PROPERIES_READ)
  @HttpCode(HttpStatus.OK)
  async getProperties(@Body() propertyFilter: PropertyFilterDto) {
    return await this.propertyService.getPropertiesByFilter(propertyFilter);
  }
}
