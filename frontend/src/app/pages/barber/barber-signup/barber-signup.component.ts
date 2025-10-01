import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { BARBER_ROUTES_PATHS } from '../../../constants/barber-route.constant';

@Component({
  selector: 'app-barber-signup',
  imports: [
    ReactiveFormsModule,
    BarberHeaderComponent,
    BarberFooterComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './barber-signup.component.html',
  styleUrl: './barber-signup.component.css',
})
export class BarberSignupComponent implements OnInit {
  barberSignupForm!: FormGroup;
  errorMessage = '';
  districts: string[] = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod',
  ];

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.barberSignupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        district: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: AbstractControl): null | object {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.barberSignupForm.valid) {
      const formData = this.barberSignupForm.value;
      this.authService
        .barberSignup(formData)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            localStorage.setItem(
              'barberSignupName',
              this.barberSignupForm.value.name
            );
            localStorage.setItem(
              'barberSignupEmail',
              this.barberSignupForm.value.email
            );

            Swal.fire({
              icon: 'success',
              title: 'Signup Successful',
              text:
                res.message || 'Please verify your email with the OTP sent.',
              confirmButtonText: 'OK',
            }).then(() => {
              this.router.navigate([BARBER_ROUTES_PATHS.VERIFY_OTP]);
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
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }
}
