import {Component, inject} from '@angular/core';
import {TranslocoModule} from "@jsverse/transloco";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ModalConfig} from "@core/models/modal-config";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmModalComponent>);
  protected readonly config = inject<ModalConfig>(MAT_DIALOG_DATA);

  public yes() {
    this.dialogRef.close(true);
  }
}
