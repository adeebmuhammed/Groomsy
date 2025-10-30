import { Component, inject, OnDestroy } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { BARBER_ROUTES_PATHS } from '../../../constants/barber-route.constant';

@Component({
  selector: 'app-barber-signin',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './barber-signin.component.html',
  styleUrl: './barber-signin.component.css',
})
export class BarberSigninComponent implements OnDestroy {
  barberLoginForm: FormGroup;
  errorMessage = '';

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.barberLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
    });
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onSubmit(): void {
    if (this.barberLoginForm.valid) {
      const { email, password } = this.barberLoginForm.value;

      this.authService
        .barberSignin({ email, password })
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: `Welcome back, ${name}!`,
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate([BARBER_ROUTES_PATHS.DASHBOARD]);
            });
          },
          error: () => {
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
}
