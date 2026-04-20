import { Component, inject, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/login/auth.service';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe, provideTranslocoScope } from '@jsverse/transloco';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslocoPipe,
    IconComponent
  ],
  providers: [provideTranslocoScope('home')],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authSvc = inject(AuthService);

  public user = this.authSvc.getCurrentSession();

  public isCollapsed = signal(false);

  public menuItems = [
    { label: 'home.home', icon: 'home', route: 'dashboard' },
  ]

  logout() {
    this.authSvc.logout();
  }

  toggleSidebar() {
    this.isCollapsed.update(state => !state);
  }
}
