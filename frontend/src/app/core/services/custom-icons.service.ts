/* import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUSTOM_ICONS } from '@shared/constants/icons';

@Injectable({
  providedIn: 'root'
})
export class CustomIconsService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerCustomIcons();
  }

  registerCustomIcons(): void {
    CUSTOM_ICONS.forEach((iconName: string) => {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`)
      );
    });
  }
}*/
