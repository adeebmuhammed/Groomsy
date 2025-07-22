import { Component } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-signin',
  imports: [ BarberHeaderComponent,BarberFooterComponent,ReactiveFormsModule,CommonModule,RouterModule ],
  templateUrl: './barber-signin.component.html',
  styleUrl: './barber-signin.component.css'
})
export class BarberSigninComponent {
  barberLoginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.barberLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ]
    });
  }

  onSubmit(): void {
  if (this.barberLoginForm.valid) {
    const { email, password } = this.barberLoginForm.value;

    this.authService.barberSignin({ email, password }).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${name}!`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/barber/dashboard']);
        });
      },
      error: (err) => {
        this.errorMessage = 'Login failed';

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.errorMessage
        });
      }
    });
  }
}
}
