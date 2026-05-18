import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@services/login/auth.service';
import { LoginService } from '@services/login/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authSvc = inject(AuthService);
  private readonly loginSvc = inject(LoginService);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.getRawValue();

    this.loginSvc.login(username!, password!)
      .subscribe({
        next: (resp) => {
          this.isLoading.set(false);
          const token = resp.headers.get(AuthService.TOKEN);

          if (token) {
            this.authSvc.setAuthToken(resp.headers);

            const decodedToken = this.jwtHelper.decodeToken(token);
            this.authSvc.setCurrentSession(decodedToken);
            this.authSvc.setRoles(decodedToken.roles);

            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage.set('Usuario o contraseña incorrectos');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Usuario o contraseña incorrectos');
          console.error('Error login:', err);
        }
      });
  }
}
