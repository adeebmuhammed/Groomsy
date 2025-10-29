import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BookingResponseDto, Service } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { ServiceService } from '../../../services/service/service.service';
import { Subject, takeUntil } from 'rxjs';
import { ROLES } from '../../../constants/roles';

@Component({
  selector: 'app-user-booking-confirmation',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './user-booking-confirmation.component.html',
  styleUrl: './user-booking-confirmation.component.css',
})
export class UserBookingConfirmationComponent implements OnInit, OnDestroy {
  bookingId!: string;
  booking!: BookingResponseDto | null;
  service!: Service | null;
  error = '';

  isSuccess = false;

  private route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private bookingService = inject(BookingService);
  private serviceService = inject(ServiceService);

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookingId) {
      this.loadBooking();
    } else {
      this.error = 'Invalid booking ID.';
    }
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loadBooking() {
    this.bookingService
      .getBookingById(ROLES.USER, this.bookingId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (res) => {
          this.booking = res;

          this.isSuccess = res.status === 'pending';

          // Fetch service
          this.serviceService
            .getServiceById(ROLES.USER, res.service)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
              next: (serviceRes) => {
                this.service = serviceRes;
              },
              error: () => {
                this.error = 'Failed to load service.';
              },
            });
        },
        error: () => {
          this.error = 'Failed to load booking details.';
        },
      });
  }

  formatTimeUTC(dateStr: Date): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  }
}
