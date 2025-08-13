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
type BookingStatus = 'pending' | 'staged' | 'cancelled' | 'finished';

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
  statuses: { label: string; value: BookingStatus }[] = [
    { label: 'Upcoming', value: 'pending' },
    { label: 'Completed', value: 'finished' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Staged', value: 'staged' },
  ];

  selectedStatus: BookingStatus = 'pending';

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pages: number[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBookingsByStatus(this.selectedStatus);
  }

  private generatePages(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchBookingsByStatus(
    status: 'pending' | 'staged' | 'cancelled' | 'finished',
    page: number = 1
  ): void {
    this.authService.userId$.subscribe((id) => {
      if (!id) return;

      this.bookingService
        .getBookingByStatus(id, status, page, this.itemsPerPage)
        .subscribe({
          next: (res) => {
            this.bookings = res.data;
            this.totalPages = Math.ceil(res.totalCount / this.itemsPerPage);
            this.currentPage = page;
            this.generatePages();
          },
          error: (err) => console.error('Failed to fetch bookings', err),
        });
    });
  }

  changeStatus(status: BookingStatus): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.fetchBookingsByStatus(status, 1);
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.fetchBookingsByStatus(this.selectedStatus, page);
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
              this.fetchBookingsByStatus(this.selectedStatus);
            },
            error: (err) => {
              console.error('Delete error:', err);
              Swal.fire('Error!', 'Failed to cancel the booking.', 'error');
            },
          });
      }
    });
  }

  retryPayment(){
    console.log("payment retry")
  }

  leaveReview(booking: BookingResponseDto) {
    console.log('review soon');
  }

  formatTimeUTC(dateStr: Date): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  }
}
