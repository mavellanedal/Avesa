import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort} from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {AbstractControl} from '@angular/forms';
import {ResponseData} from '@models/response-data'
import { BaseFilter } from '@models/base-filter'
import {MatDialog} from '@angular/material/dialog';
import {ModalConfig} from '@models/modal-config';
import {MessageModalComponent} from '@shared/components/message-modal/message-modal.component';
import {ConfirmModalComponent} from '@shared/components/confirm-modal/confirm-modal.component';
import {ErrorModalComponent} from '@shared/components/error-modal/error-modal.component';

export interface PaginableFilter {
  first?: number;
  max?: number;
  sortBy?: string;
  orderBy?: 'ASC' | 'DESC';
}

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

export class Util {

  static dateToMidnight(date: string) {
    if (typeof date === 'string') {
      const midnight = 'T23:59:59.999Z';
      return date.split('T')[0] + midnight;
    }
    return undefined;
  }

  static dateToCustomTime(date: any, time: string) {
    if (typeof date === 'string') {
      return date.split('T')[0] + 'T' + time + 'Z';
    }

    return undefined;
  }

  static dateUtc(date: Date) {
    if (date) {
      return new Date(`${date} UTC`);
    }
    return undefined;
  }

  static valueOrNull(value: any, emptyToNull: boolean = true) {
    return value != null && (!emptyToNull || emptyToNull && value !== '') ? value : null;
  }

  static objectIdOrNull(id: any): any {
    return (id != null && id !== '') ? { id } : null;
  }

  static isEllipsisNotActive(e: any) {
    return !(e.offsetWidth < e.scrollWidth);
  }

  static timeValidation(control: AbstractControl): { [key: string]: any } | null {
    return !(!control.value || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(control.value)) ? { 'time': true } : null;
  }

  static resetTableScroll() {
    document.querySelectorAll('.table-container').forEach(e => e.scrollTop = 0);
  }

  static numberOrNull(number: any, emptyToNull: boolean = true): any {
    const val = this.valueOrNull(number, emptyToNull);

    return val !== null ? Number(val) : null;
  }

  static dashOrValue(value: any): string {
    return value != null && value !== '' ? value : '-';
  }



  static setFilterMaxFirstSort(filter: BaseFilter, firstPage: boolean, paginator: MatPaginator, sizePage: number, sort: Sort | null) {
    const pageSize= paginator ? paginator.pageSize : sizePage;
    filter.max =  firstPage ? pageSize : (paginator.pageIndex + 1) * pageSize;
    filter.first = firstPage ? 1 : (paginator.pageIndex * pageSize) + 1;
    if (sort) {
      filter.sortBy = sort.active;
      filter.orderBy = sort.direction.toUpperCase();
    }
  }

  static getPageSizeOptions() {
    return [10,20,100];
  }

  static setTableResponseData<T>(
    dataSource: MatTableDataSource<T>,
    data: ResponseData<T[]>,
    selection: SelectionModel<T>,
    firstPage: boolean,
    paginator: MatPaginator,
    table: MatTable<T>,
  ): number {
    dataSource.data = data?.data ?? [];
    selection.clear();
    if (firstPage) {
      paginator.firstPage();
    }
    table.renderRows();
    return data?.totalCount ?? 0;
  }

 static openMessageModal(matDialog: MatDialog, typeConfig: ModalConfig, message: string | undefined = undefined) {
    let config = typeConfig;
    if (message) {
      config = Object.assign({}, typeConfig);
      config.message = message;
    }

    matDialog.open(MessageModalComponent, {
      height: '359px',
      width: '420px',
      data: config
    });
  }

  static openConfirmModal(matDialog: MatDialog, config: ModalConfig) {
    return matDialog.open(ConfirmModalComponent, {
      width: config.width || '420px',
      height: config.height || '360px',
      data: config
    });
  }

  static openErrorModal(matDialog: MatDialog, config: any) {
    return matDialog.open(ErrorModalComponent, {
      width: config.width || '415px',
      height: config.height || '432px',
      data: config
    });
  }
}
