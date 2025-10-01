import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import { BookingResponseDto } from '../../../interfaces/interfaces';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-admin-booking',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    FormsModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css',
})
export class AdminBookingComponent implements OnInit {
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

  private bookingService: BookingService = inject(BookingService);

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(page = 1): void {
    this.bookingService
      .fetchBookings('admin', '', page, this.itemsPerPage)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.bookings = res.data;
          this.totalPages = Math.ceil(res.totalCount / this.itemsPerPage);
          this.currentPage = page;
        },
        error: (err) => console.error('Error fetching bookings', err),
      });
  }

  handlePageChange(page: number): void {
    this.fetchBookings(page);
  }
}
