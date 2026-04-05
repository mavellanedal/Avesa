import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  host: { 'class': 'inline-flex items-center justify-center' },
  template: `
    <span
      class="material-symbols-rounded"
      [class]="customClass">
      {{ name }}
    </span>
  `
})
export class IconComponent {
  @Input({ required: true }) name!: string;

  @Input() customClass: string = '';
}
