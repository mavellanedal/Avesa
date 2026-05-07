import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {provideTranslocoScope, TranslocoModule} from '@jsverse/transloco';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {Util} from '@shared/utility/util';
import {UserTrackingService} from '@services/users-tracking/user-tracking.service';
import {TranslationValidationErrorService} from '@services/translation-validation-error.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '@services/login/auth.service';
import {User} from '@models/user-tracking/user';
import {SelectionModel} from '@angular/cdk/collections';
import {ROLES} from '@shared/constants/roles.constant';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserFilter} from '@models/user-tracking/user-filter';
import {firstValueFrom} from 'rxjs';
import UserCreateEditComponent from '@features/users-tracking/users-create-edit/user-create-edit.component';

@Component({
  selector: "app-user-tracking",
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatIcon,
    TranslocoModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatOption,
    MatSelectModule,
    NgClass,
    MatCheckboxModule,
    MatMenuModule,
    MatSortModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  providers: [
    provideTranslocoScope("user-tracking"),
  ],
  templateUrl: "./user-tracking.component.html",
  styleUrl: "./user-tracking.component.scss",
})
export default class UserTrackingComponent implements OnInit, AfterViewInit {
  protected readonly Util = Util;

  private readonly userTrackingSvc = inject(UserTrackingService);
  private readonly fb = inject(FormBuilder);
  public readonly transValidationErrorSvc = inject(TranslationValidationErrorService);
  private readonly matDialog = inject(MatDialog);
  private readonly destroy = inject(DestroyRef);
  private readonly authSvc = inject(AuthService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<User>;
  @ViewChild(MatSort) sort!: MatSort;

  public userFilterForm!: FormGroup;
  public pageSizeOptions = Util.getPageSizeOptions();
  public pageSize = this.pageSizeOptions[0];
  public resultsLength = 0;
  public selection = new SelectionModel<User>(true, []);
  public groups: any[] = [];
  // public sources: Source[] = [];
  public hasWriteRole = false;
  public dataUser: MatTableDataSource<User> = new MatTableDataSource<User>();
  public currentSort: Sort = { active: 'username', direction: 'desc' };
  public displayedColumns: string[] = [];
  public isAdmin = false;


  ngOnInit(): void {
    this.hasWriteRole = this.authSvc.hasRole(ROLES.CONFIGURATION_WRITE);
    this.isAdmin = this.authSvc.isAdmin();
    const baseColumns = [
      'state',
      'select',
      'username',
      'email',
      'createdTimestamp',
      'actions'
    ];
    this.displayedColumns = this.hasWriteRole
      ? baseColumns
      : baseColumns.filter((col) => col !== 'select');
    this.initUserForm();
    this.getUsers(true);
    this.getGroups();
    // this.getSources();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      this.getUsers();
    });
  }

  private initUserForm() {
    this.userFilterForm = this.fb.group({
      enabled: [true],
      id: [undefined, [Validators.minLength(3), Validators.maxLength(36)]],
      userName: [undefined, Validators.minLength(3)],
      firstName: [undefined, Validators.minLength(3)],
      lastName: [undefined, Validators.minLength(3)],
      email: [undefined, Validators.minLength(3)],
    });
    this.userFilterForm.markAllAsTouched();
    this.userFilterForm
      .get('id')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroy))
      .subscribe((id) => {
        this.toggleFilterById(id);
      });
  }

  private toggleFilterById(idValue: any): void {
    const disable = !!idValue;

    ['enabled', 'userName', 'firstName', 'lastName', 'email'].forEach(
      (field) => {
        const control = this.userFilterForm.get(field);
        if (!control) return;

        if (disable) {
          control.reset();
          control.disable();
        } else {
          control.enable();
          if (field === 'enabled') {
            control.setValue(true);
          }
        }
      },
    );
  }

  public cleanFilterForm() {
    this.userFilterForm.reset();
    this.userFilterForm.get('enabled')!.setValue(true);
  }

  public searchFilterUsers() {
    this.getUsers(true);
  }

  private getUserFilter(firstPage: boolean) {
    if (this.userFilterForm.invalid) return;
    const filter = new UserFilter();
    filter.id = Util.valueOrNull(this.userFilterForm.get('id')!.value);
    filter.active = Util.valueOrNull(this.userFilterForm.get('enabled')!.value);
    filter.username = Util.valueOrNull(this.userFilterForm.get('userName')!.value);
    filter.name = Util.valueOrNull(this.userFilterForm.get('firstName')!.value);
    filter.surname = Util.valueOrNull(this.userFilterForm.get('lastName')!.value);
    filter.email = Util.valueOrNull(this.userFilterForm.get('email')!.value);
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
    filter.max = pageSize;
    filter.first = firstPage ? 0 : this.paginator.pageIndex * pageSize;
    if (this.currentSort) {
      filter.sortBy = this.currentSort.active;
      filter.orderBy = this.currentSort.direction.toUpperCase();
    }
    return filter;
  }

  private getUsers(firstPage: boolean = false) {
    const filter = this.getUserFilter(firstPage);
    if (!filter) return;

    firstValueFrom(this.userTrackingSvc.getUsersByFilter(filter)).then((data) => {
      this.resultsLength = Util.setTableResponseData(
        this.dataUser,
        data,
        this.selection,
        firstPage,
        this.paginator,
        this.table
      );
    });
  }

  public async openUserModal(userEdit: User | undefined = undefined) {
    let user = undefined;
    if (userEdit && userEdit.id) {
      user = await firstValueFrom(this.userTrackingSvc.getUser(userEdit.id));
    }
    const ref = this.matDialog.open(UserCreateEditComponent, {
      height: '525px',
      width: '500px',
      data: { user: user, groups: this.groups },
      autoFocus: false
    });
    firstValueFrom(ref.afterClosed()).then((user: User | undefined) => {
      if (!user) return;
      if (userEdit && userEdit.isActive) {
        const indexUser = this.dataUser.data.findIndex((u) => u.id === user.id);
        this.dataUser.data[indexUser] = user;
        this.dataUser.data = [...this.dataUser.data];
        this.table.renderRows();
      } else {
        this.getUsers(true);
      }
    });
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataUser.data.length;
    return numSelected === numRows;
  }

  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataUser.data);
  }

  public getGroups() {
    firstValueFrom(this.userTrackingSvc.getGroups()).then((data) => {
      this.groups = data;
    });
  }

  public changeSort(sortState: Sort) {
    this.currentSort = sortState;
    this.getUsers(true);
  }
}
