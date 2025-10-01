import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { REGEX } from '../../../constants/validators';
import { OtpRequest, ResendOtpRequest } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent implements OnInit {
  @Input() purpose: 'signup' | 'forgot' = 'signup';
  @Input() userType: 'user' | 'barber' = 'user';
  @Input() verifyOtpFn!: (data: OtpRequest) => any;
  @Input() resendOtpFn!: (data: ResendOtpRequest) => any;

  otpForm: FormGroup;
  email: string | null = '';
  countdown = 60;
  isResendDisabled = true;
  interval: any;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  constructor() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(REGEX.OTP)]],
    });
  }

  ngOnInit(): void {
    const key =
      this.userType +
      (this.purpose === 'signup' ? 'SignupEmail' : 'ForgotEmail');
    this.email = localStorage.getItem(key);

    this.startResendTimer();
  }

  onSubmit(): void {
    if (this.otpForm.valid && this.email) {
      const otpValue = this.otpForm.value.otp;
      this.verifyOtpFn({
        email: this.email,
        otp: otpValue,
        purpose: this.purpose,
      }).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text:
              this.purpose === 'signup'
                ? res.message || 'Account verified!'
                : 'OTP verified. Reset your password.',
            timer: 2000,
            showConfirmButton: false,
          });

          if (
            this.purpose === 'forgot' &&
            this.userType === 'user' &&
            this.email
          ) {
            localStorage.setItem('userForgotEmail', this.email);
          } else if (
            this.purpose === 'forgot' &&
            this.userType === 'barber' &&
            this.email
          ) {
            localStorage.setItem('barberForgotEmail', this.email);
          }

          const redirect =
            this.purpose === 'signup'
              ? `/${this.userType}/signin`
              : `/${this.userType}/reset-password`;
          this.router.navigate([redirect]);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Invalid or expired OTP.',
          });
        },
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
        },
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
