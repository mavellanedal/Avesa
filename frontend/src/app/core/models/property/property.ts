import {BaseModel} from '@models/base-model';
import {PropertyOwner} from '@models/property/property-owner';
import {PropertyAddress} from '@models/property/property-address';
import {PropertyType} from '@models/property/property-type';
import {PropertyStateHistory} from '@models/property/property-state-history';

export class Property {
  public id!: string;
  public owner!: PropertyOwner;
  public address!: PropertyAddress;
  public type!: PropertyType;
  public featuresSurface!: number;
  public featuresRooms!: number;
  public featuresBathrooms!: number;
  public featuresHasElevator!: boolean;
  public featuresHasParking!: boolean;
  public featuresIsFurnished!: boolean;
  public featuresConstructionYear!: number;
  public propertyStateHistories!: PropertyStateHistory[];
  public createdAt!: Date;
  public propertyCode!: string;
}
