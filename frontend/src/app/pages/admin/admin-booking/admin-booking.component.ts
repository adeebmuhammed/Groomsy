import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import {
  BookingResponseDto,
  BookingStatus,
  IBarber,
  IUser,
  Service,
} from '../../../interfaces/interfaces';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BookingDetailsComponent } from '../../../components/shared/booking-details/booking-details.component';
import * as bootstrap from 'bootstrap';
import { ServiceService } from '../../../services/service/service.service';
import { AdminService } from '../../../services/admin/admin.service';
import { ROLES } from '../../../constants/roles';

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
export class AdminBookingComponent implements OnInit, OnDestroy {
  bookings: BookingResponseDto[] = [];
  selectedBooking: BookingResponseDto | null = null;
  selectedService: Service | null = null;
  users: IUser[] = [];
  barbers: IBarber[] = [];
  selectedSort: 'newest' | 'oldest' | 'price_low' | 'price_high' = 'newest';
  statuses: { label: string; value: BookingStatus }[] = [
    { label: 'Upcoming', value: 'pending' },
    { label: 'Completed', value: 'finished' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Staged', value: 'staged' },
  ];

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  selectedStatus: BookingStatus = 'pending';
  changeStatus(status: BookingStatus): void {
    this.selectedStatus = status;
    this.selectedSort = "newest";
    this.currentPage = 1;
    this.fetchBookingsByStatus(status,this.selectedSort, 1);
  }

  applySort(){
    this.fetchBookingsByStatus( this.selectedStatus, this.selectedSort)
  }

  fetchBookingsByStatus(
    status: 'pending' | 'staged' | 'cancelled' | 'finished',
    sort: 'newest' | 'oldest' | 'price_low' | 'price_high',
    page = 1
  ): void {
    this.bookingService
      .getBookingByStatus(null, status, sort, page, this.itemsPerPage, ROLES.ADMIN)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (res) => {
          this.bookings = res.data;
          this.totalPages = Math.ceil(res.totalCount / this.itemsPerPage);
          this.currentPage = page;
        },
        error: (err) => console.error('Failed to fetch bookings', err),
      });
  }

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private bookingService: BookingService = inject(BookingService);
  private serviceService: ServiceService = inject(ServiceService);
  private adminService: AdminService = inject(AdminService);

  ngOnInit(): void {
    this.fetchBookingsByStatus(this.selectedStatus, this.selectedSort);
    this.fetchUsers();
    this.fetchBarbers();
  }

  findUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    return user?.name || null;
  }

  findBarber(barberId: string) {
    const barber = this.barbers.find((b) => b.id === barberId);
    return barber?.name || null;
  }

  fetchUsers() {
    this.adminService
      .listUsers('', 1, 100)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.users = res?.data || [];
      });
  }

  fetchBarbers(): void {
    this.adminService
      .listBarbers('', 1, 100)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.barbers = res?.data || [];
      });
  }

  handlePageChange(page: number): void {
    this.fetchBookingsByStatus(this.selectedStatus,this.selectedSort, page);
  }

  openDetailsModal(booking: BookingResponseDto): void {
    this.selectedBooking = booking;
    this.serviceService
      .getServiceById(ROLES.ADMIN, booking.service)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (res) => {
          this.selectedService = res;

          const modalElement = document.getElementById('bookingDetailsModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
        error: (err) => {
          console.error('Error fetching service:', err);

          const modalElement = document.getElementById('bookingDetailsModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
      });
  }
}
