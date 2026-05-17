import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {TranslocoPipe} from '@jsverse/transloco';
import {MatCell, MatCellDef, MatColumnDef, MatNoDataRow, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {Property} from '@models/property/property';

interface PropertyRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-property-more-info',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIcon,
    TranslocoPipe,
    MatDialogContent,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatButton,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './property-more-info.component.html',
  styleUrl: './property-more-info.component.scss',
})
export default class PropertyMoreInfoComponent {
  protected readonly data = inject<{ property: Property }>(MAT_DIALOG_DATA);
  protected readonly displayedColumns: string[] = ['label', 'value'];
  protected readonly rows: PropertyRow[];

  constructor() {
    const p = this.data.property;
    const dash = '—';
    const yesNo = (v: boolean | undefined) => v ? 'Sí' : 'No';

    this.rows = [
      { label: 'Código',               value: p.propertyCode },
      { label: 'Estado',               value: p.propertyStateHistories?.[0]?.propertyState?.name ?? dash },
      { label: 'Tipo',                 value: p.type?.name ?? dash },
      { label: 'Ciudad',               value: p.address?.city ?? dash },
      { label: 'Provincia',            value: p.address?.province ?? dash },
      { label: 'Dirección',            value: p.address ? `${p.address.street} ${p.address.number ?? ''}`.trim() : dash },
      { label: 'Código postal',        value: p.address?.postalCode ?? dash },
      { label: 'Superficie',           value: p.featuresSurface != null ? `${p.featuresSurface} m²` : dash },
      { label: 'Habitaciones',         value: p.featuresRooms?.toString() ?? dash },
      { label: 'Baños',                value: p.featuresBathrooms?.toString() ?? dash },
      { label: 'Ascensor',             value: yesNo(p.featuresHasElevator) },
      { label: 'Parking',              value: yesNo(p.featuresHasParking) },
      { label: 'Amueblado',            value: yesNo(p.featuresIsFurnished) },
      { label: 'Año de construcción',  value: p.featuresConstructionYear?.toString() ?? dash },
      { label: 'Propietario',          value: p.owner ? `${p.owner.name} ${p.owner.surname}`.trim() : dash },
      { label: 'Teléfono propietario', value: p.owner?.phone ?? dash },
      { label: 'Email propietario',    value: p.owner?.email ?? dash },
    ];
  }
}
