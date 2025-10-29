import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '../../../components/shared/otp/otp.component';
import { OtpRequest, ResendOtpRequest } from '../../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-barber-otp',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    OtpComponent,
  ],
  templateUrl: './barber-otp.component.html',
  styleUrl: './barber-otp.component.css',
})
export class BarberOtpComponent implements OnInit, OnDestroy {
  purpose: 'signup' | 'forgot' = 'signup';

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  verifyOtpFn = (data: OtpRequest) => this.authService.barberVerifyOtp(data);
  resendOtpFn = (data: ResendOtpRequest) =>
    this.authService.barberResendOtp(data);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((params) => {
        this.purpose = params['purpose'] === 'forgot' ? 'forgot' : 'signup';
      });
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
