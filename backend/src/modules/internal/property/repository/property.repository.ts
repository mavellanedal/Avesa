import {
  Property,
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
            .select('MAX(psh_max.id)', 'max_id')
            .addSelect('psh_max.property.id', 'propertyId')
            .from(PropertyStateHistory, 'psh_max')
            .groupBy('psh_max.property.id');
        },
        'latest_history',
        'latest_history.propertyId = p.id',
      )
      .leftJoinAndMapMany(
        'p.propertyStateHistories',
        PropertyStateHistory,
        'psh',
        'psh.id = latest_history.max_id',
      )
      .leftJoinAndMapOne(
        'psh.state',
        PropertyState,
        'ps',
        'psh.state.id = ps.id',
      )
      .leftJoinAndMapOne('p.owner', PropertyOwner, 'po', 'po.id = p.owner.id')
      .innerJoinAndMapOne('p.type', PropertyType, 'pt', 'p.type.id = pt.id');

    if (propertyFilter.state) {
      query.andWhere('ps.id = :state', { active: propertyFilter.state });
    }

    if (propertyFilter.hasElevator) {
      query.andWhere('p.hasEleveator = :hasElevator', {
        hasElevator: propertyFilter.hasElevator,
      });
    }

    if (propertyFilter.typeId) {
      query.andWhere('p.type.id = :typeId', { typeId: propertyFilter.typeId });
    }

    if (propertyFilter.ownerName) {
      query.andWhere('po.name = :ownerName', {
        ownerName: propertyFilter.ownerName,
      });
    }

    if (propertyFilter.ownerNif) {
      query.andWhere('po.nif = :ownerNif', {
        ownerNif: propertyFilter.ownerNif,
      });
    }

    query.take(propertyFilter.maxResult);
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
