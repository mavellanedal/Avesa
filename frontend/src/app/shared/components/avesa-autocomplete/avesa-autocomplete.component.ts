import {Component, ElementRef, inject, input, viewChild} from '@angular/core';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {TranslocoModule} from "@jsverse/transloco";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {TranslationValidationErrorService} from "@services/translation-validation-error.service";

@Component({
  selector: 'avesa-autocomplete',
  standalone: true,
  imports: [MatAutocompleteModule, MatLabel, TranslocoModule, ReactiveFormsModule, MatInput, MatFormField, MatError],
  templateUrl: './avesa-autocomplete.component.html',
  styleUrl: './avesa-autocomplete.component.scss'
})
export class AvesaAutocompleteComponent {
  protected readonly transValidationErrorSvc = inject(TranslationValidationErrorService);

  dataAutocomplete = viewChild.required<ElementRef<HTMLInputElement>>('dataAutocomplete');
  control = input.required<any>();
  data = input.required<any>();
  label = input.required<string>();
  placeHolder = input<string>('select-one');
  requireSelection = input<boolean>(true);
  name = input<string>('name');
  customClass = input<string>('');
  filteredData!: any[];

  public filterData() {
    const filterValue = this.dataAutocomplete().nativeElement.value.toLowerCase();
    this.filteredData = this.data()?.filter((d: any) => d[this.name()].toLowerCase().includes(filterValue));
  }

  public getDataName(id: any) {
    return id ? this.data().find((d: any) => d.id == id)![this.name()] : '';
  }
}
