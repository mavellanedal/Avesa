import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {TranslocoModule} from '@jsverse/transloco';
import {Util} from '@shared/utility/util';

@Component({
  selector: 'app-lead-state-history',
  standalone: true,
  imports: [
    TranslocoModule, MatDialogTitle, MatDialogContent, MatDialogActions,
    MatDialogClose, MatButtonModule, MatTableModule, DatePipe, MatIcon,
  ],
  templateUrl: './lead-state-history.component.html',
  styleUrl: './lead-state-history.component.scss',
})
export default class LeadStateHistoryComponent {
  protected readonly Util = Util;
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly displayedColumns: string[] = ['date', 'state', 'subState', 'agent'];
}
