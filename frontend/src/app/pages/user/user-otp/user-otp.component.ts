import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-otp',
  imports: [ UserHeaderComponent,UserFooterComponent,ReactiveFormsModule,CommonModule ],
  templateUrl: './user-otp.component.html',
  styleUrl: './user-otp.component.css'
})

export class UserOtpComponent implements OnInit {
  otpForm: FormGroup;
  email: string | null = '';
  purpose: 'signup' | 'forgot' = 'signup'; // default
  countdown: number = 60;
  isResendDisabled: boolean = true;
  interval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
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
      localStorage.getItem(this.purpose === 'signup' ? 'userSignupEmail' : 'userForgotEmail');
    
    this.startResendTimer();
  }

  onSubmit(): void {
  if (this.otpForm.valid && this.email) {
    const otpValue = this.otpForm.value.otp;

    this.authService.userVerifyOtp({
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

          this.router.navigate(['/user/home']);
        } else {
          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: 'OTP verified. Please reset your password.',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate(['/user/reset-password']);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: err?.message || 'Invalid or expired OTP.',
        });
      }
    });
  }
}


  resendOtp(): void {
    if (this.email) {
      const resend$ = this.authService.userResendOtp({
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
            text: err?.message || 'Unable to resend OTP. Please try again later.',
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