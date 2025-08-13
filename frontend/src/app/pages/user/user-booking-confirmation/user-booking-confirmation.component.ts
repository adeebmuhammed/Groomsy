import { Component, inject, OnInit } from '@angular/core';
import { BookingResponseDto, Service } from '../../../interfaces/interfaces';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { ServiceService } from '../../../services/service/service.service';

@Component({
  selector: 'app-user-booking-confirmation',
  imports: [ UserHeaderComponent,UserFooterComponent,CommonModule,RouterModule ],
  templateUrl: './user-booking-confirmation.component.html',
  styleUrl: './user-booking-confirmation.component.css',
})
export class UserBookingConfirmationComponent implements OnInit {
  bookingId!: string;
  booking!: BookingResponseDto | null;
  service!: Service | null;
  error = '';

  private route = inject(ActivatedRoute);
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

  loadBooking() {
    this.bookingService.getBookingById('user', this.bookingId).subscribe({
      next: (res) => {
        this.booking = res;
        this.serviceService.getServiceById('user',res.service).subscribe({
          next:(res)=>{
            this.service = res
          },
          error:(err)=>{
            this.error = "failed to load service"
          }
        })
      },
      error: () => {
        this.error = 'Failed to load booking details.';
      },
    });
  }
}
