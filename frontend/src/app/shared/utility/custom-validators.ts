import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Util} from "@shared/utility/util";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DestroyRef} from "@angular/core";

export class CustomValidators {
  static timeValidation(withSeconds: boolean = false, minTime: string | undefined = undefined): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let result: any = !(!control.value || new RegExp(`^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]${withSeconds ? '(:[0-5][0-9])?' : ''}$`)
        .test(control.value)) ? { 'time': true } : null;
      if (result == null) {
        if (minTime && control.value && control.value < minTime) {
          result = { 'minTime': {value: minTime} };
        }
      }
      return result;
    }
  }

  static multiplesEmailsValidation(control: AbstractControl): { [key: string]: any } | null {
    const emails = control.value ? control.value.split(";").map((e:string) => e.trim()) : null;
    console.log('emails-> ' + JSON.stringify(emails));
    const forbidden = emails?.some((email: string) =>
      !(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email))
    );
    console.log('forbidden-> ' + forbidden);
    return forbidden ? { 'multi-email': true } : null;
  };

  static passwordValidation(control: AbstractControl): { [key: string]: any } | null{
    const result:{ [key: string]: any } = {};

    if (control.value) {
      const minLength = Validators.minLength(8)(control);
      if (minLength) {
        Object.assign(result, minLength);
        return result;
      }

      const minNumber = CustomValidators.minNumberValidation(1)(control);
      if (minNumber) {
        Object.assign(result, minNumber);
        return result;
      }

      const minLowerLetter = CustomValidators.minLowerLetterValidation(1)(control);
      if (minLowerLetter) {
        Object.assign(result, minLowerLetter);
        return result;
      }

      const minUpperLetter = CustomValidators.minUpperLetterValidation(1)(control);
      if (minUpperLetter) {
        Object.assign(result, minUpperLetter);
        return result;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  static minNumberValidation(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return !(!control.value || new RegExp(`(?=[0-9]).{${min}}`).test(control.value)) ? {'minNumber': {value: min}} : null;
    }
  }

  static minLowerLetterValidation(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return !(!control.value || new RegExp(`(?=[a-z]).{${min}}`).test(control.value)) ? {'minLowerLetter': {value: min}} : null;
    }
  }

  static minUpperLetterValidation(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return !(!control.value || new RegExp(`(?=[A-Z]).{${min}}`).test(control.value)) ? {'minUpperLetter': {value: min}} : null;
    }
  }

  static matchPassword(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      if (!confirmPassword.hasError('passwordNotMatch')) {
        confirmPassword.setErrors({ ...confirmPassword.errors, passwordNotMatch: true });
        confirmPassword.markAsTouched();
      }
    } else {
      if (confirmPassword.hasError('passwordNotMatch')) {
        const errors = { ...confirmPassword.errors };
        delete errors['passwordNotMatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
    return null;
  }

  static dateEndValidator(dateCompareControlName: string, destroy: DestroyRef) {
    let thisDateControl: AbstractControl;
    let otherDateControl: AbstractControl;

    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.parent) {
        return null;
      }
      if (!thisDateControl) {
        thisDateControl = control;
        otherDateControl = control.parent.get(dateCompareControlName) as AbstractControl;

        otherDateControl.valueChanges.pipe(takeUntilDestroyed(destroy)).subscribe(() => {
          thisDateControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
        });
      }
      if (!otherDateControl || !otherDateControl.value) {
        return null;
      }
      const date1 = Util.dateToCustomTime(thisDateControl.value?.toISOString(), '00:00:00.000');
      const date2 = Util.dateToCustomTime(otherDateControl.value?.toISOString(), '00:00:00.000');
      if (date1 != null && date2 != null && date1 < date2) {
        return { 'dateLessStart': true };
      }
      return null;
    };
  }
}
