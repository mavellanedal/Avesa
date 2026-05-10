import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {provideTranslocoScope, TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {AfterViewInit, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {Util} from '@shared/utility/util';
import {TranslationValidationErrorService} from '@services/translation-validation-error.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '@services/login/auth.service';
import {SelectionModel} from '@angular/cdk/collections';
import {ROLES} from '@shared/constants/roles.constant';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {firstValueFrom} from 'rxjs';
import {LeadTrackingService} from '@services/lead-tracking/lead-tracking.service';
import {SourceTrackingService} from '@services/source-tracking/source-tracking.service';
import LeadStateHistoryComponent from '@features/lead-tracking/lead-state-history/lead-state-history.component';
import {Lead} from '@models/lead/lead';
import {LeadFilter} from '@models/lead/lead-filter';
import {CustomValidators} from '@shared/utility/custom-validators';
import {Source} from '@models/source-tracking/source';
import {LeadState} from '@models/lead/lead-state';
import {MtxDatetimepickerModule} from '@ng-matero/extensions/datetimepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {AvesaAutocompleteComponent} from '@shared/components/avesa-autocomplete/avesa-autocomplete.component';

@Component({
  selector: "app-lead-tracking",
  standalone: true,
  imports: [
    MatButtonModule, MatTableModule, MatPaginatorModule, DatePipe, MatIcon,
    TranslocoModule, MatCardModule, MtxDatetimepickerModule,
    MatGridListModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule, NgClass, MatCheckboxModule, MatDatepickerModule,
    MatTooltipModule, MatMenu, MatMenuItem, MatMenuTrigger, MatTabsModule,
    AvesaAutocompleteComponent, MatSortModule
  ],
  providers: [
    provideTranslocoScope("lead-tracking"),
  ],
  templateUrl: "./lead-tracking.component.html",
  styleUrl: "./lead-tracking.component.scss",
})
export default class LeadTrackingComponent implements OnInit {
  protected readonly Util = Util;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<Lead>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('leadSubState') leadSubState!: MatSelect;

  private readonly destroy = inject(DestroyRef);
  private readonly matDialog = inject(MatDialog);
  private readonly leadTrackingSvc = inject(LeadTrackingService);
  private readonly fb = inject(FormBuilder);
  public readonly transValidationErrorSvc = inject(TranslationValidationErrorService);
  public readonly authSvc = inject(AuthService);
  public readonly sourceTrackingSvc = inject(SourceTrackingService);
  private readonly translocoSvc = inject(TranslocoService);

  public pageSizeOptions = Util.getPageSizeOptions();
  public pageSize = this.pageSizeOptions[0];
  public displayedColumns: string[] = [];
  public resultsLength = 0;
  public dataLead: MatTableDataSource<Lead> = new MatTableDataSource<Lead>();
  public selection = new SelectionModel<Lead>(true, []);

  public sources: Source[] = [];
  public leadStates: LeadState[] = [];
  public hasWriteRole = false;

  public leadFilterForm!: FormGroup;
  public maxResultSizes = [100, 250, 500, 1000];
  public defaultMaxResult = this.maxResultSizes[1];
  public currentSort: Sort = { active: 'date', direction: 'desc' };
  public showAdvanced = signal(false);

  ngOnInit(): void {
    this.hasWriteRole = this.authSvc.hasRole(ROLES.LEADS_WRITE);
    const baseColumns = [
      'select',
      'leadCode',
      'source',
      'name',
      'email',
      'phone',
      'date',
      'state',
      'subState',
      'actions'
    ];
    this.displayedColumns = this.hasWriteRole ? baseColumns : baseColumns.filter(col => col !== 'select');
    this.initLeadForm();
    this.getLeads(true);
    this.getLeadStates();
    this.getSources();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      this.getLeads();
    });
  }

  private initLeadForm(): void {
    this.leadFilterForm = this.fb.group({
      leadCode: [undefined, [Validators.minLength(3)]],
      name: [undefined, Validators.minLength(3)],
      surname: [undefined, Validators.minLength(3)],
      email: [undefined, Validators.minLength(3)],
      phone: [undefined, Validators.minLength(3)],
      startDate: undefined,
      endDate: [undefined, CustomValidators.dateEndValidator('startDate', this.destroy)],
      leadState: [''],
      leadSubState: [''],
      source: [''],
      maxResult: [this.defaultMaxResult]
    });
  }

  public leadStateValueChange(event: any) {
    this.leadSubState.setDisabledState(!event);
    if (event === '') {
      this.leadFilterForm.get('leadSubState')?.setValue('')
    }
  }

  public checkAndSetEndDate() {
    const dateValue = this.leadFilterForm.get('endDate')?.value;
    if (!dateValue) return;

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return;

    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
      const newDate = new Date(d);
      newDate.setHours(23, 59, 59, 0);
      this.leadFilterForm.get('endDate')?.setValue(newDate);
    }
  }

  private getLeads(firstPage: boolean = false) {
    const filter = this.getLeadFilter(firstPage);
    if (filter) {
      firstValueFrom(this.leadTrackingSvc.getLeads(filter)).then(data => {
        this.resultsLength = Util.setTableResponseData(this.dataLead, data, this.selection, firstPage, this.paginator, this.table);
      });
    }
  }

  public sortChange(sortState: Sort) {
    this.currentSort = sortState;
    this.getLeads(true);
  }


  public cleanFilterForm() {
    this.leadFilterForm.reset();
    this.leadFilterForm.get('leadState')?.setValue('');
    this.leadSubState.setDisabledState(true);
    this.leadFilterForm.get('leadSubState')?.setValue('');
    this.leadFilterForm.get('source')?.setValue('');
    this.leadFilterForm.get('maxResult')?.setValue('');
  }

  public searchFilterLeads() {
    this.getLeads(true);
  }



  private getLeadFilter(firstPage: boolean) {
    if (this.leadFilterForm.invalid) return;
    const filter = new LeadFilter();
    const formValues = this.leadFilterForm.value;

    filter.leadCode = Util.valueOrNull(formValues.leadCode);
    filter.name = Util.valueOrNull(formValues.name);
    filter.surname = Util.valueOrNull(formValues.surname);
    filter.email = Util.valueOrNull(formValues.email);
    filter.phone = Util.valueOrNull(formValues.phone);
    filter.startDate = Util.valueOrNull(formValues.startDate?.toISOString());
    filter.endDate = Util.valueOrNull(formValues.endDate?.toISOString());
    filter.stateId = Util.valueOrNull(formValues.leadState);
    filter.subStateId = Util.valueOrNull(formValues.leadSubState);
    filter.sourceId = Util.valueOrNull(formValues.source);
    filter.maxResult = formValues.maxResult;

    Util.setFilterMaxFirstSort(filter, firstPage, this.paginator, this.pageSize, this.currentSort);
    return filter;
  }

  public async openLeadStateHistoryModal(lead: Lead) {
    const histories = await firstValueFrom(this.leadTrackingSvc.getLeadStateHistories(lead.id as unknown as string));
    (document.activeElement as HTMLElement)?.blur();
    this.matDialog.open(LeadStateHistoryComponent, {
      width: '750px',
      maxHeight: '80vh',
      data: { leadCode: lead.leadCode, histories },
    });
  }

  public getSources() {
    firstValueFrom(this.sourceTrackingSvc.getLightSources()).then(data => this.sources = data);
  }
  public getLeadStates() {
    firstValueFrom(this.leadTrackingSvc.getLeadStates()).then(data => this.leadStates = data);
  }

  public toggleAdvancedFilter(): void {
    this.showAdvanced.set(!this.showAdvanced());
    setTimeout(() => this.leadSubState?.setDisabledState(true), 100);
    if (!this.showAdvanced()) {
      this.resetAdvancedFields();
    }
  }

  private resetAdvancedFields(): void {
    const fields = ['startDate', 'endDate', 'product', 'leadState', 'leadSubState', 'source', 'destination'];
    fields.forEach(f => this.leadFilterForm.get(f)?.reset());
  }

  public isAllSelected() {
    return this.selection.selected.length === this.dataLead.data.length;
  }

  public toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataLead.data);
  }
}
