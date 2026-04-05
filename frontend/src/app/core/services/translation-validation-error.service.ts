import { Injectable } from "@angular/core";
import { TranslocoMissingHandler, TranslocoMissingHandlerData } from "@jsverse/transloco";

@Injectable({ providedIn: "root" })
export class TranslationValidationErrorService implements TranslocoMissingHandler {
  handle(key: string, data: TranslocoMissingHandlerData) {
    console.warn(`Missing translation for key: ${key} in language: ${data.activeLang}`);
    return `[${key}]`;
  }
}
