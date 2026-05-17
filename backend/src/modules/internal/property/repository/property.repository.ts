import {
  Property,
  PropertyAddress,
  PropertyOwner,
  PropertyState,
  PropertyStateHistory,
  PropertyType,
} from '@entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '@shared/repositories/custom-repository';
import { DataSource } from 'typeorm';
import { PropertyFilterDto } from '@dtos/property/property-filter.dto';

@Injectable()
export class PropertyRepository extends CustomRepository<Property> {
  private readonly sortMap = {
    createdAt: 'p.createdAt',
    state: 'ps.name',
    ownerName: 'po.name',
  };

  constructor(private readonly dataSource: DataSource) {
    super(Property, dataSource.createEntityManager());
  }
  public async getPropertiesByFilter(propertyFilter: PropertyFilterDto) {
    const qb = this.createQueryBuilder('p');
    const query = qb
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('MAX(psh_max.changeDate)', 'max_date')
            .addSelect('psh_max.property_id', 'property_id')
            .from(PropertyStateHistory, 'psh_max')
            .groupBy('psh_max.property_id');
        },
        'latest_history',
        'latest_history.property_id = p.id',
      )
      .leftJoinAndMapMany(
        'p.propertyStateHistories',
        PropertyStateHistory,
        'psh',
        'psh.changeDate = latest_history.max_date AND psh.property_id = p.id',
      )
      .leftJoinAndSelect('psh.propertyState', 'ps')
      .leftJoinAndMapOne('p.owner', PropertyOwner, 'po', 'po.id = p.owner.id')
      .innerJoinAndMapOne('p.type', PropertyType, 'pt', 'p.type.id = pt.id')
      .leftJoinAndMapOne(
        'p.address',
        PropertyAddress,
        'pa',
        'pa.property_id = p.id',
      );

    if (propertyFilter.propertyCode) {
      query.where('p.propertyCode LIKE :propertyCode', {
        propertyCode: `%${propertyFilter.propertyCode}%`,
      });
    }

    if (propertyFilter.stateId) {
      query.andWhere('ps.id = :state', { state: propertyFilter.stateId });
    }

    if (propertyFilter.typeId) {
      query.andWhere('p.type.id = :type', { type: propertyFilter.typeId });
    }

    if (propertyFilter.city) {
      query.andWhere('UPPER(LTRIM(RTRIM(pa.city))) LIKE :city', {
        city: `%${propertyFilter.city.toUpperCase()}%`,
      });
    }

    if (propertyFilter.startDate) {
      query.andWhere('p.createdAt >= :startDate', {
        startDate: propertyFilter.startDate,
      });
    }

    if (propertyFilter.endDate) {
      query.andWhere('p.createdAt <= :endDate', {
        endDate: propertyFilter.endDate,
      });
    }

    if (propertyFilter.surfaceMin) {
      query.andWhere('p.featuresSurface >= :surfaceMin', {
        surfaceMin: propertyFilter.surfaceMin,
      });
    }

    if (propertyFilter.surfaceMax) {
      query.andWhere('p.featuresSurface <= :surfaceMax', {
        surfaceMax: propertyFilter.surfaceMax,
      });
    }

    if (propertyFilter.rooms) {
      query.andWhere('p.featuresRooms >= :rooms', {
        rooms: propertyFilter.rooms,
      });
    }

    if (propertyFilter.bathrooms) {
      query.andWhere('p.featuresBathrooms >= :bathrooms', {
        bathrooms: propertyFilter.bathrooms,
      });
    }

    if (propertyFilter.hasElevator != null) {
      query.andWhere('p.featuresHasElevator = :hasElevator', {
        hasElevator: propertyFilter.hasElevator,
      });
    }

    if (propertyFilter.hasPool != null) {
      query.andWhere('p.featuresHasPool = :hasPool', {
        hasPool: propertyFilter.hasPool,
      });
    }

    if (propertyFilter.hasParking != null) {
      query.andWhere('p.featuresHasParking = :hasParking', {
        hasParking: propertyFilter.hasParking,
      });
    }

    if (propertyFilter.isFurnished != null) {
      query.andWhere('p.featuresIsFurnished = :isFurnished', {
        isFurnished: propertyFilter.isFurnished,
      });
    }

    if (propertyFilter.constructionYear) {
      query.andWhere('p.featuresConstructionYear = :constructionYear', {
        constructionYear: propertyFilter.constructionYear,
      });
    }

    query.limit(propertyFilter.maxResult);
    query.orderBy(
      this.sortMap[propertyFilter.sortBy] || 'p.createdAt',
      propertyFilter.orderBy || 'DESC',
    );
    return this.paginateResults(
      await query.getMany(),
      propertyFilter.first,
      propertyFilter.max,
      propertyFilter.maxResult,
      true,
    );
  }
}
