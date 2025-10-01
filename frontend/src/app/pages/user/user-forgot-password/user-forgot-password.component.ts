import { Component, inject, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-forgot-password',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './user-forgot-password.component.html',
  styleUrl: './user-forgot-password.component.css',
})
export class UserForgotPasswordComponent implements OnInit {
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.userForgotPassword(email).pipe(take(1)).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Reset link sent to your email.',
            confirmButtonText: 'OK',
          }).then(() => {
            localStorage.setItem('userForgotEmail', email);
            this.router.navigate([USER_ROUTES_PATHS.VERIFY_OTP], {
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
