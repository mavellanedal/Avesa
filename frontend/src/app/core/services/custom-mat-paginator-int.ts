import { DestroyRef, inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  private readonly translocoSvc = inject(TranslocoService);
  private readonly destroy: DestroyRef = inject(DestroyRef);

  separatorOf!: string;

  constructor() {
    super();
    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = '';
    this.nextPageLabel = '';
    this.previousPageLabel = '';
    this.firstPageLabel = '';
    this.lastPageLabel = '';
    this.separatorOf = '';

    this.translocoSvc
      .selectTranslateObject('table-paginator')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((translation) => {
        this.itemsPerPageLabel = translation['items-per-page'];
        this.nextPageLabel = translation['next-page'];
        this.previousPageLabel = translation['previous-page'];
        this.firstPageLabel = translation['first-page'];
        this.lastPageLabel = translation['last-page'];
        this.separatorOf = translation['separator-of'];
      });
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 ${this.separatorOf} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${this.separatorOf} ${length}`;
  };
}
