import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '../../../components/shared/otp/otp.component';

interface OtpRequest{
  email: string;
  otp: string;
  purpose: 'signup' | 'forgot';
}

interface ResendOtpRequest {
  email: string;
  purpose: 'signup' | 'forgot';
}

@Component({
  selector: 'app-barber-otp',
  imports: [ BarberHeaderComponent,BarberFooterComponent,ReactiveFormsModule,CommonModule,OtpComponent ],
  templateUrl: './barber-otp.component.html',
  styleUrl: './barber-otp.component.css'
})

export class BarberOtpComponent implements OnInit {
  purpose: 'signup' | 'forgot' = 'signup';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  verifyOtpFn = (data: OtpRequest) => this.authService.barberVerifyOtp(data);
  resendOtpFn = (data: ResendOtpRequest) => this.authService.barberResendOtp(data);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.purpose = params['purpose'] === 'forgot' ? 'forgot' : 'signup';
    });
  }
}
