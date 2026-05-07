import {Component, inject} from '@angular/core';
import {TranslocoModule} from "@jsverse/transloco";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import {ModalConfig} from "@core/models/modal-config";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    TranslocoModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.scss'
})
export class MessageModalComponent {
  private readonly dialogRef = inject(MatDialogRef<MessageModalComponent>);
  protected readonly config = inject<ModalConfig>(MAT_DIALOG_DATA);

  public yes() {
    this.dialogRef.close(true);
  }
}
