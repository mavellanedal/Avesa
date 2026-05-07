import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgHttpLoaderComponent, Spinkit} from 'ng-http-loader';
import {NotLoaderOperationsService} from '@services/not-loader-operations.service';
import {MatIconRegistry} from '@angular/material/icon';
// import {CustomIconsService} from '@services/custom-icons.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgHttpLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly notLoaderOperationsSvc = inject(NotLoaderOperationsService);
  public readonly matIconRegistry = inject(MatIconRegistry);
  // public readonly customIconsService = inject(CustomIconsService);

  public spinkit = Spinkit;
  title = 'Avesa Proptech';

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
    // this.customIconsService.registerCustomIcons();
  }
}
