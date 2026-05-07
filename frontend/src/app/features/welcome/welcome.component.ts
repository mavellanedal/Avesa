import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslocoPipe} from '@jsverse/transloco';
import DashboardComponent from '@features/dashboard/dashboard.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatTabsModule, TranslocoPipe, DashboardComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export default class WelcomeComponent {}
