import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {provideTranslocoScope, TranslocoModule} from '@jsverse/transloco';
import {LeadStateHistory} from '@models/lead/lead-state-history';

export interface LeadStateHistoryDialogData {
  leadCode: string;
  histories: LeadStateHistory[];
}

@Component({
  selector: 'app-lead-state-history',
  imports: [
    TranslocoModule, MatDialogTitle, MatDialogContent, MatDialogActions,
    MatDialogClose, MatButtonModule, MatTableModule, DatePipe, MatIcon,
  ],
  providers: [provideTranslocoScope('lead-tracking')],
  templateUrl: './lead-state-history.component.html',
  styleUrl: './lead-state-history.component.scss',
})
export default class LeadStateHistoryComponent {
  protected readonly data = inject<LeadStateHistoryDialogData>(MAT_DIALOG_DATA);
  protected readonly displayedColumns = ['date', 'state', 'subState', 'agent'];
}
