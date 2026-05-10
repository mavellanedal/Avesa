import { Component, DestroyRef, effect, inject, signal} from "@angular/core";
import { provideTranslocoScope, TranslocoModule, TranslocoPipe} from "@jsverse/transloco";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {User} from '@models/user-tracking/user';
import {UserTrackingService} from '@services/users-tracking/user-tracking.service';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslationValidationErrorService} from '@services/translation-validation-error.service';
import {CustomValidators} from '@shared/utility/custom-validators';
import {firstValueFrom} from 'rxjs';
import {Util} from '@shared/utility/util';
import {ModalConfig} from '@models/modal-config';
import { MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckbox} from '@angular/material/checkbox';
import {AppUser} from '@models/user-tracking/app-user';

@Component({
  selector: 'app-user-create-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatGridListModule,
    TranslocoModule,
    MatDialogTitle,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatCheckbox
  ],
  providers: [
    provideTranslocoScope('user-tracking'),
  ],
  templateUrl: './user-create-edit.component.html',
  styleUrl: './user-create-edit.component.scss'
})
export default class UserCreateEditComponent {
  private readonly destroy: DestroyRef = inject(DestroyRef);
  private readonly matDialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<UserCreateEditComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly editUser!: User;
  protected readonly userTrackingSvc = inject(UserTrackingService);
  private readonly fb = inject(FormBuilder);
  public readonly transValidationErrorSvc = inject(TranslationValidationErrorService);

  public userForm!: FormGroup;
  public hidePassword = signal(true);
  public hideConfirmPassword = signal(true);
  public changePassword = signal(false);

  userNameExistsPromise: Promise<void> | null = null;

  constructor() {
    this.editUser = this.data.user;
    this.initUserForm();

    const password = this.userForm.get('password');
    const confirmPassword = this.userForm.get('confirmPassword');
    effect(() => {
      if (this.changePassword() ||!this.editUser) {
        password?.setValidators([Validators.required, CustomValidators.passwordValidation]);
        confirmPassword?.setValidators([Validators.required]);
      } else {
        password?.setValue(null);
        confirmPassword?.setValue(null);
        password?.setValidators(null);
        confirmPassword?.setValidators(null);
      }
      password?.updateValueAndValidity();
      confirmPassword?.updateValueAndValidity();
    });
    /*
    const userSource = this.userForm.get('userSource')!;
    this.userForm.get('userGroup')!.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(value => {
      if(value && value.includes(GROUPS.PROVIDER)) {
        userSource.setValidators(Validators.required);
      } else {
        userSource.clearValidators();
      }
      if (!this.isShowUserSource()) {
        userSource.setValue(undefined);
      }
      userSource.updateValueAndValidity();
    });
    })*/
    this.userForm.get('userGroup')?.updateValueAndValidity();
  }

  public initUserForm(): void {
    this.userForm = this.fb.group({
      userName: [{ value: this.editUser?.username ? this.editUser.username : undefined, disabled: this.editUser },
        [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      firstName: [this.editUser?.appUser?.name ? this.editUser?.appUser?.name : undefined, Validators.required],
      lastName: [this.editUser?.appUser?.surname ? this.editUser?.appUser?.surname : undefined],
      email: [this.editUser?.appUser?.email ? this.editUser?.appUser?.email : undefined, Validators.email],
      identificationNumber: [this.editUser?.appUser?.identificationNumber ? this.editUser?.appUser?.identificationNumber : undefined, Validators.required],
      password: [undefined, undefined],
      confirmPassword: [undefined, undefined],
      userGroup: [this.editUser?.groups || [], Validators.required],
      enabled: [this.editUser?.isActive != null ? this.editUser.isActive : true]
    }, {
      validators: CustomValidators.matchPassword
    });
  }

  public async createUser() {
    await this.userNameExistsPromise;
    if (this.userForm.valid) {
      const user = new User();
      user.appUser = new AppUser();

      if (this.editUser) {
        user.id = this.editUser.id;
        if (this.userForm.get('userGroup')!.dirty) {
          user.groups = this.userForm.get('userGroup')!.value;
        }
      } else {
        user.username = this.userForm.get('userName')!.value;
        user.groups = this.userForm.get('userGroup')!.value;
      }
      if (this.userForm.get('password')!.value) {
        user.password = this.userForm.get('password')!.value;
      }
      if (user && user.appUser) {
        user.appUser.email = this.userForm.get('email')!.value;
        user.appUser.name = this.userForm.get('firstName')!.value;
        user.appUser.surname = this.userForm.get('lastName')!.value;
        user.isActive = this.userForm.get('enabled')!.value;
        user.appUser.identificationNumber = this.userForm.get('identificationNumber')!.value;
      }
      if (this.editUser) {
        firstValueFrom(this.userTrackingSvc.updateUser(user)).then((updatedUser) => {
          this.dialogRef.close(updatedUser);
          Util.openMessageModal(this.matDialog, ModalConfig.TYPE_GREAT);
        });
      } else {
        firstValueFrom(this.userTrackingSvc.createUser(user)).then(createdUser => {
          this.dialogRef.close(createdUser);
          Util.openMessageModal(this.matDialog, ModalConfig.TYPE_GREAT);
        });
      }
    }
  }

  public async userNameExistsValidator(control: AbstractControl | undefined | null)  {
    if (control && control.valid && control.value) {
      this.userNameExistsPromise = new Promise<void>(async resolve => {
        if (await firstValueFrom(this.userTrackingSvc.existsUser(control.value))) {
          control.setErrors({userNameExists: true});
        }
        resolve();
      });
    }
  }

  public compareGroups(g1: any, g2: any): boolean {
    return g1 && g2 ? g1.id === g2.id : g1 === g2;
  }
}
