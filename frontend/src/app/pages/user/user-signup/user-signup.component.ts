import { Component, inject } from '@angular/core';
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
import { environment } from '../../../../environments/environment';
import { take } from 'rxjs';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-signup',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent {
  signupForm: FormGroup;
  errorMessage = '';

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.matchPasswords }
    );
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      this.authService
        .userSignup(formData)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('userSignupName', this.signupForm.value.name);
            localStorage.setItem(
              'userSignupEmail',
              this.signupForm.value.email
            );

            Swal.fire({
              icon: 'success',
              title: 'Signup Successful',
              text:
                res.message || 'Please verify your email with the OTP sent.',
              confirmButtonText: 'OK',
            }).then(() => {
              this.router.navigate([USER_ROUTES_PATHS.VERIFY_OTP]);
            });
          },
          error: (err) => {
            console.error('Signup Error:', err);
            this.errorMessage = 'Signup failed. Please try again.';

            Swal.fire({
              icon: 'error',
              title: 'Signup Failed',
              text: this.errorMessage,
            });
          },
        });
    }
  }

  signUpWithGoogle() {
    window.location.href = `${environment.apiBaseUrl}/user/auth/google`;
  }
}
