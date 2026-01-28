import { EntityTarget } from 'typeorm/common/EntityTarget';
import { FunctionalRole } from './functional-role.entity';
import { Source } from './source.entity';
import { PaymentMethod } from './payment-method.entity';
import { Availability } from './availability.entity';
import { LeadState } from './lead-state.entity';
import { PropertyType } from './property-type.entity';
import { PropertyState } from './property-state.entity';
import { IncidentPriority } from './incident-priority.entity';
import { IncidentCategory } from './incident-category.entity';
import { IncidentState } from './incident-state.entity';
import { IncidentAction } from './incident-action.entity';
import { StorageFile } from './storage-file.entity';
import { AppUser } from './app-user.entity';
import { LoginUser } from './login-user.entity';
import { PropertyOwner } from './property-owner.entity';
import { Property } from './property.entity';
import { PropertyAddress } from './property-address.entity';
import { PropertyStateHistory } from './property-state-history.entity';
import { Lead } from './lead.entity';
import { LeadStateHistory } from './lead-state-history.entity';
import { Incident } from './incident.entity';
import { IncidentOwner } from './incident-owner.entity';
import { IncidentComment } from './incident-comment.entity';
import { IncidentAttachment } from './incident-attachment.entity';
import { IncidentStateHistory } from './incident-state-history.entity';
import { BlackListType } from './black-list-type.entity';
import { BlackList } from './black-list.entity';

export function getEntities(): EntityTarget<unknown>[] {
  return [
    FunctionalRole,
    Source,
    PaymentMethod,
    Availability,
    LeadState,
    PropertyType,
    PropertyState,
    IncidentPriority,
    IncidentCategory,
    IncidentState,
    IncidentAction,
    StorageFile,
    AppUser,
    LoginUser,
    PropertyOwner,
    Property,
    PropertyAddress,
    PropertyStateHistory,
    Lead,
    LeadStateHistory,
    Incident,
    IncidentOwner,
    IncidentComment,
    IncidentAttachment,
    IncidentStateHistory,
    BlackListType,
    BlackList,
  ];
}
