import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { WelcomeLeadFilter } from '@models/welcome/welcome-lead-filter';
import { WelcomeService } from '@services/welcome/welcome.service';
import { Util } from '@shared/utility/util';
import { firstValueFrom } from 'rxjs';
import { IconComponent } from "@shared/components/icon.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TranslocoPipe,
    IconComponent
],
  providers: [provideTranslocoScope('welcome')],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit{
  private readonly welcomeSvc = inject(WelcomeService);
  private readonly fb = inject(FormBuilder);

  public welcomeLeadFilterForm!: FormGroup;

  public welcomeLeads: any;

  ngOnInit(): void {
    this.initWelcomeLeadFilter();
    this.onSearch();
  }

  public initWelcomeLeadFilter(): void {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    this.welcomeLeadFilterForm = this.fb.group({
      startDate: [startDate],
      endDate: [endDate],
    });
  }

  public onSearch() {
    if (this.welcomeLeadFilterForm.invalid) return;

    const filter = new WelcomeLeadFilter();
    filter.startDate = Util.valueOrNull(this.welcomeLeadFilterForm.get('startDate')?.value);
    filter.endDate = Util.valueOrNull(this.welcomeLeadFilterForm.get('endDate')?.value);

    this.getWelcomeLeads(filter);
  }

  getWelcomeLeads(filter: WelcomeLeadFilter) {
    firstValueFrom(this.welcomeSvc.getWelcomwLead(filter)).then(data => {
      this.welcomeLeads = data;
    });
  }

  public getInitials(name?: string, surname?: string): string {
    const n = name ? name.charAt(0).toUpperCase() : '';
    const s = surname ? surname.charAt(0).toUpperCase() : '';
    return (n + s) || 'U';
  }

}
