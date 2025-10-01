import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OtpComponent } from '../../../components/shared/otp/otp.component';
import { OtpRequest, ResendOtpRequest } from '../../../interfaces/interfaces';
import { take } from 'rxjs';

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

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  verifyOtpFn = (data: OtpRequest) => this.authService.userVerifyOtp(data);
  resendOtpFn = (data: ResendOtpRequest) =>
    this.authService.userResendOtp(data);

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.purpose = params['purpose'] === 'forgot' ? 'forgot' : 'signup';
    });
  }
}
