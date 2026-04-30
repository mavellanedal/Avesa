import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface PaginableFilter {
  first?: number;
  max?: number;
  sortBy?: string;
  orderBy?: 'ASC' | 'DESC';
}

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

export class Util {

  static valueOrNull<T>(value: T | null | undefined): T | null {
    return value === undefined ? null : value;
  }

  static getPageSizeOptions(): number[] {
    return [...PAGE_SIZE_OPTIONS];
  }

  static setFilterMaxFirstSort<T extends PaginableFilter>(
    filter: T,
    firstPage: boolean,
    paginator: MatPaginator,
    pageSize: number,
    sort?: MatSort,
  ): void {
    const page = firstPage ? 0 : paginator.pageIndex;
    const size = firstPage ? pageSize : paginator.pageSize;

    filter.first = page * size + 1;
    filter.max = (page + 1) * size;
    filter.sortBy = sort?.active || undefined;
    filter.orderBy = sort?.direction ? (sort.direction.toUpperCase() as 'ASC' | 'DESC') : undefined;

    if (firstPage) {
      paginator.pageIndex = 0;
    }
  }

  static setTableResponseData<T>(
    dataSource: MatTableDataSource<T>,
    data: unknown,
    selection: SelectionModel<T>,
    firstPage: boolean,
    paginator: MatPaginator,
    table: MatTable<T>,
  ): number {
    const [rows, total] = data as [T[], number];
    dataSource.data = rows ?? [];
    selection.clear();
    if (firstPage) {
      paginator.pageIndex = 0;
    }
    table.renderRows();
    return total ?? 0;
  }
}
