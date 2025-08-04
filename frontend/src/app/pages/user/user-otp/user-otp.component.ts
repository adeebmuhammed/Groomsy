import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-user-otp',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    OtpComponent,
  ],
  templateUrl: './user-otp.component.html',
  styleUrl: './user-otp.component.css',
})
export class UserOtpComponent implements OnInit {
  purpose: 'signup' | 'forgot' = 'signup';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  verifyOtpFn = (data: OtpRequest) => this.authService.userVerifyOtp(data);
  resendOtpFn = (data: ResendOtpRequest) => this.authService.userResendOtp(data);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.purpose = params['purpose'] === 'forgot' ? 'forgot' : 'signup';
    });
  }
}
