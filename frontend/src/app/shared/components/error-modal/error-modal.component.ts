import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ApiError} from "@core/models/security/api-error";
import {TranslocoModule} from "@jsverse/transloco";
import {ErrorType} from "@shared/constants/error-type.constant";

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [
    MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIcon, TranslocoModule
  ],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public error: ApiError) {}

  protected readonly ErrorType = ErrorType;
}
