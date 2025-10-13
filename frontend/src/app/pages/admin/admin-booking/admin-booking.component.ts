import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import {
  BookingResponseDto,
  IBarber,
  IUser,
  Service,
} from '../../../interfaces/interfaces';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { BookingDetailsComponent } from '../../../components/shared/booking-details/booking-details.component';
import * as bootstrap from 'bootstrap';
import { ServiceService } from '../../../services/service/service.service';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-admin-booking',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    FormsModule,
    DatePipe,
    CommonModule,
    BookingDetailsComponent,
  ],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css',
})
export class AdminBookingComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  selectedBooking: BookingResponseDto | null = null;
  selectedService: Service | null = null;
  users: IUser[] = [];
  barbers: IBarber[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private bookingService: BookingService = inject(BookingService);
  private serviceService: ServiceService = inject(ServiceService);
  private adminService: AdminService = inject(AdminService);

  ngOnInit(): void {
    this.fetchBookings();
    this.fetchUsers();
    this.fetchBarbers();
  }

  findUser(userId: string){
    const user = this.users.find((u)=> u.id === userId)
    return user?.name || null;
  }

  findBarber(barberId: string){
    const barber = this.barbers.find((b)=> b.id === barberId)
    return barber?.name || null;
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

  fetchUsers() {
    this.adminService
      .listUsers('', 1, 100)
      .pipe(take(1))
      .subscribe((res) => {
        this.users = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  fetchBarbers(): void {
    this.adminService
      .listBarbers('', 1, 100)
      .pipe(take(1))
      .subscribe((res) => {
        this.barbers = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  handlePageChange(page: number): void {
    this.fetchBookings(page);
  }

  openDetailsModal(booking: BookingResponseDto): void {
    this.selectedBooking = booking;
    this.serviceService
      .getServiceById('admin', booking.service)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.selectedService = res;

          // Only show modal after data is fetched
          const modalElement = document.getElementById('bookingDetailsModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
        error: (err) => {
          console.error('Error fetching service:', err);

          // Even if service fails, still show modal with booking info
          const modalElement = document.getElementById('bookingDetailsModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
      });
  }
}
