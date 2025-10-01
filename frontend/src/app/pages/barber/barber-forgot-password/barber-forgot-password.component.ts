import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { BARBER_ROUTES_PATHS } from '../../../constants/barber-route.constant';

@Component({
  selector: 'app-barber-forgot-password',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './barber-forgot-password.component.html',
  styleUrl: './barber-forgot-password.component.css',
})
export class BarberForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.barberForgotPassword(email).pipe(take(1)).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Reset link sent to your email.',
            confirmButtonText: 'OK',
          }).then(() => {
            localStorage.setItem('barberForgotEmail', email);
            this.router.navigate([BARBER_ROUTES_PATHS.VERIFY_OTP], {
              queryParams: { purpose: 'forgot' },
            });
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.',
          });
        },
      });
    }
  }
}
