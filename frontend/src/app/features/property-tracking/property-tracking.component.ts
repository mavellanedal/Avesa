import {AfterViewInit, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslationValidationErrorService} from '@services/translation-validation-error.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PropertyTrackingService} from '@services/property-tracking/property-tracking.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '@services/login/auth.service';
import { ROLES } from '@shared/constants/roles.constant'
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {Util} from '@shared/utility/util';
import {SelectionModel} from '@angular/cdk/collections';
import {Property} from '@models/property/property';
import {PropertyState} from '@models/property/property-state';
import {PropertyType} from '@models/property/property-type';
import {CustomValidators} from '@shared/utility/custom-validators';
import {PropertyFilter} from '@models/property/property-filter';
import { firstValueFrom } from "rxjs";
import {MatTabsModule} from '@angular/material/tabs';
import {provideTranslocoScope, TranslocoPipe} from '@jsverse/transloco';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {AvesaAutocompleteComponent} from '@shared/components/avesa-autocomplete/avesa-autocomplete.component';
import {NumbersOnlyDirective} from '@core/directives/numbers-only.directive';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import PropertyStateHistoryComponent
  from '@features/property-tracking/property-state-history/property-state-history.component';
import {MatOption, MatSelect} from '@angular/material/select';
import PropertyMoreInfoComponent from '@features/property-tracking/property-more-info/property-more-info.component';

@Component({
  selector: 'property-tracking-component',
  standalone: true,
  imports: [
    MatTabsModule,
    TranslocoPipe,
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    AvesaAutocompleteComponent,
    MatInput,
    NumbersOnlyDirective,
    MatCheckbox,
    MatButton,
    NgClass,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatSortHeader,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatPaginatorModule,
    MatSelect,
    MatError,
    MatOption,
  ],
  providers: [
    provideTranslocoScope("property-tracking")
  ],
  templateUrl: './property-tracking.component.html',
  styleUrl: './property-tracking.component.scss',
})
export default class PropertyTrackingComponent implements OnInit, AfterViewInit {
  private readonly propertyTrackingSvc = inject(PropertyTrackingService);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  private readonly destroy = inject(DestroyRef);
  private readonly authSvc = inject(AuthService);
  public readonly transValidationErrorSvc = inject(TranslationValidationErrorService);
  public readonly Util = Util;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<Property>;
  @ViewChild(MatSort) sort!: MatSort;

  public propertyFilterForm!: FormGroup;
  public pageSizeOptions = Util.getPageSizeOptions();
  public pageSize = this.pageSizeOptions[0];
  public resultsLength = 0;
  public selection = new SelectionModel<Property>(true, []);
  public dataProperty: MatTableDataSource<Property> = new MatTableDataSource<Property>();
  public currentSort: Sort = { active: 'createdAt', direction: 'desc' };
  public displayedColumns: string[] = [];
  public hasWriteRole = false;
  public isAdmin = false;
  public maxResultSizes = [100, 250, 500, 1000];
  public defaultMaxResult = this.maxResultSizes[1];
  public showAdvanced = signal(false);
  public propertyStates: PropertyState[] = [];
  public propertyTypes: PropertyType[] = [];
  public cities: string[] = [];

  ngOnInit() {
    this.hasWriteRole = this.authSvc.hasRole(ROLES.PROPERTIES_WRITE);
    this.isAdmin = this.authSvc.isAdmin();
    const baseColumns = [
      'code',
      'state',
      'type',
      'city',
      'surface',
      'rooms',
      'bathrooms',
      'isFurnished',
      'actions',
    ]
    this.displayedColumns = this.hasWriteRole
      ? baseColumns
      : baseColumns.filter((col) => col !== 'select');

    this.initPropertyForm();
    this.getProperties(true);
    this.getPropertyStates();
    this.getPropertyTypes();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      this.getProperties();
    });
  }

  private initPropertyForm() {
    this.propertyFilterForm = this.fb.group({
      propertyCode: [undefined, Validators.minLength(3)],
      propertyState: [''],
      propertyType: [''],
      city: [''],
      surfaceMin: [undefined, Validators.minLength(2)],
      surfaceMax: [undefined, Validators.minLength(2)],
      rooms: [undefined, Validators.minLength(1)],
      bathrooms: [undefined, Validators.minLength(1)],
      hasElevator: [''],
      hasPool: [''],
      hasParking: [''],
      isFurnished: [''],
      constructionYear: [undefined, Validators.minLength(4)],
      maxResult: [this.maxResultSizes[0]],
    });
  }

  private getPropertyFilter (firstPage: boolean) {
    if (this.propertyFilterForm.invalid) return;
    const filter = new PropertyFilter();
    const formValues = this.propertyFilterForm.value;

    filter.propertyCode = Util.valueOrNull(formValues.propertyCode);
    filter.stateId = Util.valueOrNull(formValues.propertyState);
    filter.typeId = Util.valueOrNull(formValues.propertyType);
    filter.city = Util.valueOrNull(formValues.city);
    filter.surfaceMax = Util.numberOrNull(formValues.surfaceMax);
    filter.surfaceMin = Util.numberOrNull(formValues.surfaceMin);
    filter.rooms = Util.numberOrNull(formValues.rooms);
    filter.hasElevator = Util.valueOrNull(formValues.hasElevator);
    filter.hasPool = Util.valueOrNull(formValues.hasPool);
    filter.hasParking = Util.valueOrNull(formValues.hasParking);
    filter.isFurnished = Util.valueOrNull(formValues.isFurnished);
    filter.constructionYear = Util.numberOrNull(formValues.constructionYear);
    filter.maxResult = formValues.maxResult;

    Util.setFilterMaxFirstSort(filter, firstPage, this.paginator, this.pageSize, this.currentSort);
    return filter;
  }

  private getProperties(firstPage: boolean = false) {
    const filter = this.getPropertyFilter(firstPage);
    if (filter) {
      firstValueFrom(this.propertyTrackingSvc.getProperties(filter)).then(data => {
        this.resultsLength = Util.setTableResponseData(this.dataProperty, data, this.selection, firstPage, this.paginator, this.table);
      })
    }
  }

  public sortChanges(sortState: Sort) {
    this.currentSort = sortState;
    this.getProperties(true);
  }

  public cleanPropertyFilter() {
    this.propertyFilterForm.reset();
    this.propertyFilterForm.get('propertyType')?.setValue('');
    this.propertyFilterForm.get('maxResult')?.setValue(this.maxResultSizes[0]);
  }

  public searchFilterProperties() {
    this.getProperties(true);
  }

  public async openPropertyStateHistory(property: Property) {
    const histories = await firstValueFrom(this.propertyTrackingSvc.getPropertyStateHistories(property.id));
    const ref = this.matDialog.open(PropertyStateHistoryComponent, {
      width: '750px',
      maxHeight: '80vh',
      data: { propertyCode: property.propertyCode, histories: histories },
    });
  }

  public openPropertyMoreInfo(property: Property) {
    const ref = this.matDialog.open(PropertyMoreInfoComponent, {
      width: '750px',
      maxHeight: '80vh',
      data: { property: property}
    })
  }

  public toggleAdvancedFilter(): void {
    this.showAdvanced.set(!this.showAdvanced());
    if (!this.showAdvanced()) {
      this.resetAdvancedFields();
    }
  }

  private resetAdvancedFields(): void {
    const fields = ['surfaceMax', 'surfaceMin', 'rooms', 'hasElevator', 'hasPool', 'hasParking', 'isFurnished', 'constructionYear'];
    fields.forEach(f => this.propertyFilterForm.get(f)?.reset());
  }

  public isAllSelected() {
    return this.selection.selected.length === this.dataProperty.data.length;
  }

  public toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataProperty.data);
  }

  private getPropertyStates() {
    firstValueFrom(this.propertyTrackingSvc.getPropertyStates()).then(data => this.propertyStates = data);
  }

  private getPropertyTypes() {
    firstValueFrom(this.propertyTrackingSvc.getPropertyTypes()).then(data => this.propertyTypes = data);
  }
}
