import { Component, inject, OnDestroy } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-signin',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './user-signin.component.html',
  styleUrl: './user-signin.component.css',
})
export class UserSigninComponent implements OnDestroy {
  loginForm: FormGroup;
  errorMessage = '';

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService
        .userSignin({ email, password })
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (res) => {
            const name = res?.user?.name || 'User';

            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: `Welcome back, ${name}!`,
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate([USER_ROUTES_PATHS.HOME]);
            });
          },
          error: (err) => {
            this.errorMessage = 'Login failed';

            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: this.errorMessage,
            });
          },
        });
    }
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.apiBaseUrl}/user/auth/google`;
  }
}
