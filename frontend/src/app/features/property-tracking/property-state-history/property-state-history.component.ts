import {Component, inject} from '@angular/core';
import {Util} from '@shared/utility/util';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {TranslocoPipe} from '@jsverse/transloco';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-property-state-hisotry',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIcon,
    TranslocoPipe,
    MatDialogContent,
    MatTable,
    MatColumnDef,
    DatePipe,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatNoDataRow
  ],
  templateUrl: './property-state-history.component.html',
  styleUrl: './property-state-history.component.scss',
})
export default class PropertyStateHistoryComponent {
  protected readonly Util = Util;
  protected data = inject(MAT_DIALOG_DATA);
  protected readonly displayedColumns: string[] = ['date', 'state', 'agent'];
}
