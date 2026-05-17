import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PropertyRepository } from '@modules/internal/property/repository/property.repository';
import {
  AppUser,
  Property,
  PropertyState,
  PropertyStateHistory,
  PropertyType,
  PaymentMethod,
  Lead,
} from '@entities';
import { Util } from '@shared/utilities/util';
import { PropertyOwnerRepository } from '../repository/property-owner.repository';
import { PropertyStateHistoryRepository } from '../repository/property-state-history.repository';
import { PROPERTY_SYSTEM } from '@shared/constants/property-system.constant';
import { PropertyFilterDto } from '@dtos/property/property-filter.dto';
import { ResponseDataDto } from '@dtos/common/response-data.dto';
import { plainToInstance } from 'class-transformer';
import { PropertyDto } from '@dtos/property/property.dto';
import { PropertyStateHistoryDto } from '@dtos/property/property-state-history.dto';
import { PropertyStateDto } from '@dtos/property/property-state.dto';
import { PropertyStateRepository } from '@modules/internal/property/repository/property-state.repository';
import { PropertyTypeRepository } from '@modules/internal/property/repository/property-type.repository';
import { PropertyTypeDto } from '@dtos/property/property-type.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);

  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyOwnerRepository: PropertyOwnerRepository,
    private readonly propertyStateHistoryRepository: PropertyStateHistoryRepository,
    private readonly propertyStateRepository: PropertyStateRepository,
    private readonly propertyTypeRepository: PropertyTypeRepository,
  ) {}

  public async createProperty(
    newProperty: Property,
    typeId: number,
  ): Promise<Property | null> {
    return Util.transactional(async () => {
      const code = nanoid(PROPERTY_SYSTEM.NANOID_MAX_LENGTH);
      const date = new Date();
      newProperty.propertyCode = code;
      newProperty.createdAt = date;
      newProperty.type = { id: typeId } as PropertyType;

      if (newProperty.owner) {
        if (!newProperty.owner.paymentMethod) {
          newProperty.owner.paymentMethod = { id: 1 } as PaymentMethod;
        }

        newProperty.owner.id = (
          await this.propertyOwnerRepository.insert(newProperty.owner)
        ).identifiers[0].id as string;
      }

      newProperty.id = (await this.propertyRepository.insert(newProperty))
        .generatedMaps[0]?.id as string;

      await this.createPropertyStateHistory(
        newProperty,
        date,
        PROPERTY_SYSTEM.PROPERTY_STATE.AVAILABLE,
      );
      return newProperty;
    }).catch((error) => {
      this.logger.error(
        'Se ha producido un error al crear la Propiedad',
        error,
      );
      throw new InternalServerErrorException(
        'Se ha producido un error al crear la Propiedad',
      );
    });
  }

  public async createPropertyStateHistory(
    newProperty: Property,
    date: Date,
    stateId: number,
    user?: AppUser,
  ): Promise<void> {
    const newHistory = new PropertyStateHistory();
    newHistory.property = newProperty;
    newHistory.changeDate = date;
    newHistory.propertyState = { id: stateId } as PropertyState;

    if (user) {
      newHistory.appUser = user;
    }

    await this.propertyStateHistoryRepository.insert(newHistory);
  }

  public async getPropertiesByFilter(propertyFilterDto: PropertyFilterDto) {
    const [properties, total] =
      await this.propertyRepository.getPropertiesByFilter(propertyFilterDto);
    return new ResponseDataDto(
      plainToInstance(PropertyDto, <Property[]>properties, {
        strategy: 'excludeAll',
      }),
      <number>total,
    );
  }

  public async getPropertyStateHistories(
    propertyId: string,
  ): Promise<PropertyStateHistoryDto[]> {
    const propertyStateHistories =
      await this.propertyStateHistoryRepository.getPropertyStateHistories(
        propertyId,
      );

    return plainToInstance(PropertyStateHistoryDto, propertyStateHistories, {
      strategy: 'excludeAll',
    });
  }

  public async getPropertyStates(): Promise<PropertyStateDto[]> {
    const propertyStates =
      await this.propertyStateRepository.getPropertyStates();
    return plainToInstance(PropertyStateDto, propertyStates, {
      strategy: 'excludeAll',
    });
  }

  public async getPropertyTypes(): Promise<PropertyTypeDto[]> {
    const propertyTypes = await this.propertyTypeRepository.getPropertyTypes();

    return plainToInstance(PropertyTypeDto, propertyTypes, {
      strategy: 'excludeAll',
    });
  }
}
