import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { User } from "@models/auth/user";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { UserTrackingService } from "@services/users-tracking/user-tracking.service";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TranslationValidationErrorService } from "@services/translation-validation-error.service";
import { firstValueFrom } from "rxjs";
import { UserFilter } from "@models/user-tracking/user-filter";
import { Util } from "@shared/utility/util";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import UserCreateEditComponent from "./users-create-edit/user-create-edit.component";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: "app-user-tracking",
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOption,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MtxDatetimepickerModule,
    ReactiveFormsModule,
    TranslocoModule
  ],
  providers: [
    provideTranslocoScope("user-tracking"),
  ],
  templateUrl: "./user-tracking.component.html",
  styleUrl: "./user-tracking.component.scss",
})
export default class UserTrackingComponent implements OnInit, AfterViewInit {
  private readonly userTrackingSvc = inject(UserTrackingService);
  private readonly fb = inject(FormBuilder);
  private readonly transValidationErrorSvc = inject(TranslationValidationErrorService);
  private readonly matDialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<User>;
  @ViewChild(MatSort) sort!: MatSort;

  public userTrackingFilterForm!: FormGroup;
  public pageSizeOptions = Util.getPageSizeOptions();
  public pageSize = this.pageSizeOptions[0];
  public resultsLength = 0;
  public selection = new SelectionModel<User>(true, []);
  public dataUsers: MatTableDataSource<User> = new MatTableDataSource<User>();
  public currentSort: Sort = { active: 'id', direction: 'desc' };
  public displayedColumns = ['state', 'select', 'username', 'email', 'createdDate', 'actions'];

  ngOnInit(): void {
    this.initFitlerForm();
  }

  ngAfterViewInit() {
    this.getUsers();
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      this.getUsers();
    });
  }
  private initFitlerForm() {
    this.userTrackingFilterForm = this.fb.group({
      active: [true],
      identificationNumber: [undefined, Validators.minLength(3)],
      username: [undefined, Validators.minLength(3)],
      name: [undefined, Validators.minLength(3)],
      surname: [undefined, Validators.minLength(3)],
      email: [undefined, Validators.email],
    })
  }

  public cleanFilterForm() {
    this.userTrackingFilterForm.reset();
    this.userTrackingFilterForm.patchValue({
      active: true,
      identificationNumber: '',
      username: '',
      name: '',
      surname: '',
      email: ''
    })
  }

  public applyFilterForm() {
    if (this.userTrackingFilterForm.invalid) return;
    this.getUsers(true);
  }

  private getUserFilter(firstPage: boolean) {
    if (this.userTrackingFilterForm.invalid) return;
    const filter = new UserFilter();
    filter.active = Util.valueOrNull(this.userTrackingFilterForm.get('active')!.value);
    filter.identificationNumber = Util.valueOrNull(this.userTrackingFilterForm.get('identificationNumber')!.value);
    filter.username = Util.valueOrNull(this.userTrackingFilterForm.get('username')!.value);
    filter.name = Util.valueOrNull(this.userTrackingFilterForm.get('name')!.value);
    filter.surname = Util.valueOrNull(this.userTrackingFilterForm.get('surname')!.value);
    filter.email = Util.valueOrNull(this.userTrackingFilterForm.get('email')!.value);

    Util.setFilterMaxFirstSort(filter, firstPage, this.paginator, this.pageSize, this.sort);
    return filter;
  }

  private getUsers(firstPage: boolean = false) {
    const filter = this.getUserFilter(firstPage);
    if (!filter) return;

    firstValueFrom(this.userTrackingSvc.getUsersByFilter(filter)).then((data) => {
      this.resultsLength = Util.setTableResponseData(
        this.dataUsers,
        data,
        this.selection,
        firstPage,
        this.paginator,
        this.table
      );
    });
  }

  public async openUserModal(userEdit: User | undefined = undefined) {
    const ref = this.matDialog.open(UserCreateEditComponent, {
      height: '525px',
      width: '500px',
      data: { user: userEdit },
      autoFocus: false
    });
    firstValueFrom(ref.afterClosed()).then((user: User | undefined) => {
      if (!user) return;
      this.getUsers(true);
    });
  }

  public isAllSelected(): boolean {
    return this.dataUsers.data.length > 0 &&
      this.selection.selected.length === this.dataUsers.data.length;
  }

  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataUsers.data.forEach(row => this.selection.select(row));
  }

  public sortChanges(sortState: Sort) {
    this.currentSort = sortState;
    this.getUsers(true);
  }
}
