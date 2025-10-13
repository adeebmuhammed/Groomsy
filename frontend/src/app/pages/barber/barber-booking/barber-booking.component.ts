import { Component, inject, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../../services/booking/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { BookingResponseDto, IUser, Service } from '../../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { BarberService } from '../../../services/barber/barber.service';
import * as bootstrap from 'bootstrap';
import { ServiceService } from '../../../services/service/service.service';
import { BookingDetailsComponent } from '../../../components/shared/booking-details/booking-details.component';

@Component({
  selector: 'app-barber-booking',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    CommonModule,
    DatePipe,
    BookingDetailsComponent
  ],
  templateUrl: './barber-booking.component.html',
  styleUrl: './barber-booking.component.css',
})
export class BarberBookingComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  selectedBooking: BookingResponseDto | null = null;
    selectedService: Service | null = null;
    users: IUser[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private bookingService: BookingService = inject(BookingService);
  private authService: AuthService = inject(AuthService);
  private barberService: BarberService = inject(BarberService);
  private serviceService: ServiceService = inject(ServiceService);

  ngOnInit(): void {
    this.fetchBarberBookings();
    this.fetchUsers();
  }

  findUser(userId: string){
    const user = this.users.find((u)=> u.id === userId)
    return user?.name || null;
  }

  fetchBarberBookings(page = 1): void {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }

      this.bookingService
        .fetchBookings('barber', id, page, this.itemsPerPage)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.bookings = res.data;

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
      .pipe(take(1))
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

  fetchUsers() {
    this.barberService
      .fetchUsers('', 1, 100)
      .pipe(take(1))
      .subscribe((res) => {
        this.users = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  handlePageChange(page: number): void {
    this.fetchBarberBookings(page);
  }

  openDetailsModal(booking: BookingResponseDto): void {
    this.selectedBooking = booking;
    this.serviceService
      .getServiceById('barber', booking.service)
      .pipe(take(1))
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
