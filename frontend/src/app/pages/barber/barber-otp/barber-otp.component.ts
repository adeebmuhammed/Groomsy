import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-otp',
  imports: [ BarberHeaderComponent,BarberFooterComponent,ReactiveFormsModule,CommonModule ],
  templateUrl: './barber-otp.component.html',
  styleUrl: './barber-otp.component.css'
})

export class BarberOtpComponent implements OnInit {
  otpForm: FormGroup;
  email: string | null = '';
  purpose: 'signup' | 'forgot' = 'signup'; // default
  countdown = 60;
  isResendDisabled = true;
  interval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.purpose = params['purpose'] === 'forgot' ? 'forgot' : 'signup';
    });

    this.email =
      localStorage.getItem(this.purpose === 'signup' ? 'barberSignupEmail' : 'barberForgotEmail');
    
    this.startResendTimer();
  }

  onSubmit(): void {
  if (this.otpForm.valid && this.email) {
    const otpValue = this.otpForm.value.otp;

    this.authService.barberVerifyOtp({
      email: this.email,
      otp: otpValue,
      purpose: this.purpose
    }).subscribe({
      next: (res) => {
        if (this.purpose === 'signup') {
          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: res.message || 'Your account has been successfully verified!',
            timer: 2000,
            showConfirmButton: false,
          });
          
          localStorage.clear()
          this.router.navigate(['/barber/signin']);
        } else {
          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: 'OTP verified. Please reset your password.',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate(['/barber/reset-password']);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: 'Invalid or expired OTP.',
        });
      }
    });
  }
}

  resendOtp(): void {
    if (this.email) {
      const resend$ = this.authService.barberResendOtp({
  email: this.email,
  purpose: this.purpose
});


      resend$.subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'OTP Resent',
            text: res.message || 'A new OTP has been sent to your email.',
            timer: 2000,
            showConfirmButton: false,
          });
          this.startResendTimer();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Resend Failed',
            text: 'Unable to resend OTP. Please try again later.',
          });
        }
      });
    }
  }

  startResendTimer(): void {
    this.isResendDisabled = true;
    this.countdown = 60;

    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.isResendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }
}
