import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import { BookingService } from '../../../services/booking/booking.service';
import { BookingResponseDto } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-booking',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    CommonModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './user-booking.component.html',
  styleUrl: './user-booking.component.css',
})
export class UserBookingComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  columns = [
    { key: 'slotDetails.date', label: 'Date', isDate: true },
    { key: 'slotDetails.startTime', label: 'Start Time', isDate: true },
    { key: 'slotDetails.endTime', label: 'End Time', isDate: true },
    { key: 'status', label: 'Status', isStatus: true },
    { key: 'totalPrice', label: 'Price' },
  ];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  pages: number[] = [];

  private generatePages(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchUserBookings(page: number = 1): void {
    this.authService.userId$.subscribe((id) => {
      if (!id) return;

      this.bookingService
        .fetchBookings('user', id, page, this.itemsPerPage)
        .subscribe({
          next: (res) => {
            this.bookings = res.data;
            this.totalPages = Math.ceil(res.totalCount / this.itemsPerPage);
            this.currentPage = page;
            this.generatePages(); // ✅ build page numbers array
          },
          error: (err) => console.error('Failed to fetch bookings', err),
        });
    });
  }

  cancelBooking(booking: BookingResponseDto): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService
          .updateBookingStatus('user', booking.id, 'cancel')
          .subscribe({
            next: () => {
              Swal.fire('Cancelled!', 'Booking has been cancelled.', 'success');
              this.fetchUserBookings();
            },
            error: (err) => {
              console.error('Delete error:', err);
              Swal.fire('Error!', 'Failed to cancel the booking.', 'error');
            },
          });
      }
    });
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.fetchUserBookings(page);
  }
}
