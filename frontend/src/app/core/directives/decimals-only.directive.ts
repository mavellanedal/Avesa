import { Directive, AfterViewInit, ElementRef, Input, inject, HostListener, DestroyRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: 'input[decimalsOnly]',
  standalone: true,
})
export class DecimalsOnlyDirective implements AfterViewInit {
  @Input() placeholder = '0,00';
  @Input() maximumDecimals = 2;

  private elementRef = inject(ElementRef<HTMLInputElement>);
  private destroyRef = inject(DestroyRef);
  private ngControl = inject(NgControl);

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement;
    input.setAttribute('placeholder', this.placeholder);
    this.validate(input.value, input);

    this.ngControl.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        const initialValue = typeof value === 'string' ? value.replace(/[^0-9,.]/g, '') : '';
        if (value !== initialValue) {
          this.ngControl.control?.setValue(initialValue, { emitEvent: false });
        }
      });
  }

  @HostListener('blur', ['$event']) onBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    this.validate(input.value, input);
  }

  @HostListener('focus') onFocus() {
    this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.replace('.', '');
  }

  private validate(value: string, input: any) {
    if (value == null || value == '' || /[^0-9,.]/.test(value)) {
      this.ngControl.control?.setValue(null, { emitEvent: false });
      input.value = '';
      return;
    }

    const parsedStr = this.parseValue(value).toString();
    const match = parsedStr.match(/^\d*\.?\d{0,2}/);
    const validValue = match ? match[0] : '';

    if (parsedStr !== validValue) {
      const truncated = parseFloat(validValue);
      this.ngControl.control?.setValue(truncated, { emitEvent: false });
    }
    input.value = this.formatValue(parseFloat(validValue));
  }

  private parseValue(val: string): number {
    const hasComma = val.includes(',');

    if (hasComma && val.includes('.')) {
      val = val.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      val = val.replace(',', '.');
    }

    return parseFloat(val);
  }

  private formatValue(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: this.maximumDecimals,
      useGrouping: true
    }).format(value);
  }
}
