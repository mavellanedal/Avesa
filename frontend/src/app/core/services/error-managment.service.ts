import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ApiError } from "@models/security/api-error";
import { Util } from "@shared/utility/util";

@Injectable({
  providedIn: 'root',
})
export class ErrorManagementService {
  private readonly matDialog = inject(MatDialog);

  public apiError!: ApiError;

  onNotify(error: ApiError) {
    this.apiError = error;
    this.showPopup();
  }

  public showPopup() {
    const config = {
      data: this.apiError,
      width: '432px',
      height: '415px',
    };

    // Util.openErrorModal(this.matDialog, config);
  }
}
