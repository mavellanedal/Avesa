import { Component, inject, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/login/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authSvc = inject(AuthService);
  public user = this.authSvc.currentUser;

  public isCollapsed = signal(false);

  public menuItems = [
    { label: 'Inicio', icon: 'home', route: 'dashboard' },
  ]

  logout() {
    this.authSvc.logout();
  }

  toggleSidebar() {
    this.isCollapsed.update(state => !state);
  }
}
