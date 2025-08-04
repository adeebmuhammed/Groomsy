import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp',
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  @Input() purpose: 'signup' | 'forgot' = 'signup';
  @Input() userType: 'user' | 'barber' = 'user'; // to change headers/footers if needed
  @Input() verifyOtpFn!: (data: any) => any;     // service call
  @Input() resendOtpFn!: (data: any) => any;     // service call

  otpForm: FormGroup;
  email: string | null = '';
  countdown = 60;
  isResendDisabled = true;
  interval: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    const key = this.userType + (this.purpose === 'signup' ? 'SignupEmail' : 'ForgotEmail');
    this.email = localStorage.getItem(key);

    this.startResendTimer();
  }

  onSubmit(): void {
    if (this.otpForm.valid && this.email) {
      const otpValue = this.otpForm.value.otp;
      this.verifyOtpFn({ email: this.email, otp: otpValue, purpose: this.purpose }).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: this.purpose === 'signup' ? (res.message || 'Account verified!') : 'OTP verified. Reset your password.',
            timer: 2000,
            showConfirmButton: false,
          });

          if (this.purpose === 'forgot' && this.userType === 'user'  &&this.email) {
            localStorage.setItem("userForgotEmail", this.email);
          }else if (this.purpose === 'forgot' && this.userType === 'barber'  &&this.email) {
            localStorage.setItem("barberForgotEmail", this.email);
          }
          

          const redirect = this.purpose === 'signup' ? `/${this.userType}/signin` : `/${this.userType}/reset-password`;
          this.router.navigate([redirect]);
        },
        error: (err: any) => {
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
      this.resendOtpFn({ email: this.email, purpose: this.purpose }).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'OTP Resent',
            text: res.message || 'New OTP sent to your email.',
            timer: 2000,
            showConfirmButton: false,
          });
          this.startResendTimer();
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Resend Failed',
            text: 'Unable to resend OTP.',
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
