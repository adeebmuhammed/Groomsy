import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-forgot-password',
  imports: [ BarberHeaderComponent,BarberFooterComponent,ReactiveFormsModule,CommonModule ],
  templateUrl: './barber-forgot-password.component.html',
  styleUrl: './barber-forgot-password.component.css'
})
export class BarberForgotPasswordComponent{
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  
    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
      this.forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }
  
    onSubmit(): void {
      if (this.forgotPasswordForm.valid) {
        const { email } = this.forgotPasswordForm.value;
        this.authService.barberForgotPassword(email).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.message || 'Reset link sent to your email.',
              confirmButtonText: 'OK'
            }).then(() => {
              localStorage.setItem('barberForgotEmail', email);
              this.router.navigate(['/barber/verify-otp'], { queryParams: { purpose: 'forgot' } });
            });
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong.',
            });
          }
        });
      }
    }
}
