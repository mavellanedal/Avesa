import {AbstractControl} from "@angular/forms";
import {inject, Injectable} from "@angular/core";
import {Translation, TranslocoService} from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class TranslationValidationErrorService {
  private readonly translocoSvc = inject(TranslocoService);

  constructor() {
    this.translocoSvc.load('validation/es').subscribe();
  }

  private validationErrorMessages: Translation = {
    "min": (control:AbstractControl) => {
      return control.errors?.['min']?.min;
    },
    "max": (control:AbstractControl) => {
      return control.errors?.['max']?.max;
    },
    "minlength": (control:AbstractControl) => {
      return control.errors?.['minlength']?.requiredLength;
    },
    "maxlength": (control:AbstractControl) => {
      return control.errors?.['maxlength']?.requiredLength;
    },
    "minNumber": (control:AbstractControl) => {
      return control.errors?.['minNumber']?.value;
    },
    "minLowerLetter": (control:AbstractControl) => {
      return control.errors?.['minLowerLetter']?.value;
    },
    "minUpperLetter": (control:AbstractControl) => {
      return control.errors?.['minUpperLetter']?.value;
    },
    "minTime" : (control:AbstractControl) => {
      return control.errors?.['minTime']?.value;
    },
  };

  public getValidationErrorMessage(control: AbstractControl | null) {
    if (control && control.errors) {
      const keyError = Object.keys(control.errors)[0];
      return this.translocoSvc.translate(`validation.${keyError}`,
        { value: this.validationErrorMessages[keyError] ? this.validationErrorMessages[keyError](control) : undefined }
      );
    }
    return undefined;
  }
}
