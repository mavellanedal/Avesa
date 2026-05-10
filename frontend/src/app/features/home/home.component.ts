import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/login/auth.service';
import { TranslocoPipe, provideTranslocoScope } from '@jsverse/transloco';
import { UserToken } from '@models/security/user-token';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {ROLES} from '@shared/constants/roles.constant';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslocoPipe,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [provideTranslocoScope('home')],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly authSvc = inject(AuthService);
  public user!: UserToken;
  public isCollapsed = signal(false);

  public menuItems = [
    {
      label: 'home.home',
      icon: 'home',
      route: 'dashboard',
      visible: true
    },
    {
      label: 'home.user-tracking',
      icon: 'manage_accounts',
      route: 'user-tracking',
      visible: this.authSvc.hasRole(ROLES.CONFIGURATION_READ)
    },
    {
      label: 'home.lead-tracking',
      icon: 'phone_enabled',
      route: 'lead-tracking',
      visible: this.authSvc.hasRole(ROLES.LEADS_READ)
    }
  ];

  ngOnInit() {
    this.user = this.authSvc.getCurrentSession();
  }

  public logout() {
    this.authSvc.logout();
  }

  toggleSidebar() {
    this.isCollapsed.update(state => !state);
  }
}
