import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-barber-reset-password',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './barber-reset-password.component.html',
  styleUrl: './barber-reset-password.component.css',
})
export class BarberResetPasswordComponent implements OnDestroy {
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
      const email = localStorage.getItem('barberForgotEmail');
      this.authService
        .barberResetPassword({ email, password, confirmPassword })
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
              this.router.navigate(['/barber/signin']);
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
