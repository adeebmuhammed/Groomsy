import { Component, inject, OnDestroy } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-reset-password',
  imports: [UserHeaderComponent, UserFooterComponent, ReactiveFormsModule],
  templateUrl: './user-reset-password.component.html',
  styleUrl: './user-reset-password.component.css',
})
export class UserResetPasswordComponent implements OnDestroy {
  resetPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.value;
      const email = localStorage.getItem('userForgotEmail');
      this.authService
        .userResetPassword({ email, password, confirmPassword })
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.message || 'Password Reset Successfully',
              confirmButtonText: 'OK',
            }).then(() => {
              localStorage.clear();
              this.router.navigate([USER_ROUTES_PATHS.SIGNIN]);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Reset Password Failed',
              text: 'Reset Password Failed',
            });
          },
        });
    }
  }
}
