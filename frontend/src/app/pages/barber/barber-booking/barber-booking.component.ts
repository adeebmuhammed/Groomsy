import { Component } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../../services/booking/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { BookingResponseDto } from '../../../interfaces/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-booking',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './barber-booking.component.html',
  styleUrl: './barber-booking.component.css',
})
export class BarberBookingComponent {
  bookings: BookingResponseDto[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBarberBookings();
  }

  fetchBarberBookings(page: number = 1): void {
    this.authService.barberId$.subscribe((id) => {
      if (!id) {
        return;
      }

      this.bookingService
        .fetchBookings('barber', id, page, this.itemsPerPage)
        .subscribe({
          next: (res) => {
            this.bookings = res.data;
            console.log(this.bookings);

            this.totalPages = Math.ceil(res.totalCount / this.itemsPerPage);
            this.currentPage = page;
          },
          error: (err) => console.error('Failed to fetch bookings', err),
        });
    });
  }

  onStatusChange(event: Event, booking: BookingResponseDto): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    if (!newStatus) return;

    this.updateStatus(newStatus, booking);
  }

  updateStatus(status: string, booking: BookingResponseDto): void {
    this.bookingService
      .updateBookingStatus('barber', booking.id, status)
      .subscribe({
        next: () => {
          Swal.fire('Updated!', 'Booking status has been updated.', 'success');
          this.fetchBarberBookings(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error!', 'Failed to cancel the booking.', 'error');
        },
      });
  }

  handlePageChange(page: number): void {
    this.fetchBarberBookings(page);
  }
}
