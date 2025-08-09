import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import {
  BarberDto,
  BarberUnavailabilityDto,
  BookingCreateRequestDto,
  IBarber,
  Service,
  SlotDto,
  SlotResponse,
  SlotTime,
} from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { SlotTableModalComponent } from '../../../components/shared/slot-table-modal/slot-table-modal.component';
import Swal from 'sweetalert2';
import { BookingService } from '../../../services/booking/booking.service';
import { ServiceCardComponent } from '../../../components/shared/service-card/service-card.component';
import { ServiceService } from '../../../services/service/service.service';
import { BarberUnavailabilityService } from '../../../services/barber-unavailability/barber-unavailability.service';

@Component({
  selector: 'app-user-barber-details',
  imports: [
    CommonModule,
    UserHeaderComponent,
    UserFooterComponent,
    FormsModule,
    SlotTableModalComponent,
    ServiceCardComponent,
  ],
  templateUrl: './user-barber-details.component.html',
  styleUrl: './user-barber-details.component.css',
})
export class UserBarberDetailsComponent implements OnInit {
  barber: BarberDto | null = null;
  slots: SlotDto[] = [];
  barberId: string = '';
  selectedDate: string = '';
  populatedSlots: SlotResponse = {};
  fetchedDate: string = '';
  todayDate: string = '';
  services: Service[] = [];
  barberUnavailability: BarberUnavailabilityDto | null = null;

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private activatedRoute = inject(ActivatedRoute);
  private serviceService = inject(ServiceService);
  private barberUnavailabilityService = inject(BarberUnavailabilityService);

  selectedService: Service | null = null;

  selectService(service: Service): void {
    this.selectedService = service;

    this.barberUnavailabilityService
      .fetchBarberUnavailability(this.barberId, 'user')
      .subscribe({
        next: (res) => {
          this.barberUnavailability = res;
          this.bookSlotFromOutside();
        },
        error: (err) => {
          console.error('Error fetching unavailability:', err);
        },
      });
  }

  ngOnInit(): void {
    this.barberId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.todayDate = new Date().toISOString().split('T')[0];
    forkJoin({
      barbers: this.userService.fetchBarbers(),
      services: this.serviceService.fetch('user', '', 1, 100),
    }).subscribe({
      next: ({ barbers, services }) => {
        const found = barbers.data.find((b) => b.id === this.barberId);
        this.barber = found || null;

        this.services = services.data;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  fetchBarberDetails() {
    this.userService.fetchBarbers().subscribe((res) => {
      const found = res.data.find((b) => b.id === this.barberId);
      this.barber = found || null;
    });
  }

  fetchSlots() {
    this.userService.fetchSlotRulesByBarber(this.barberId).subscribe((res) => {
      this.slots = res.data;
    });
  }

  bookSlotFromOutside(): void {
    const modalEl = document.getElementById('bookingModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  submitDate(): void {
    if (!this.selectedDate || !this.selectedService) {
      alert('Please select a service and date.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (this.selectedDate < today) {
      alert('Please select a future date.');
      return;
    }

    this.userService
      .fetchPopulatedSlots(
        this.selectedDate,
        1,
        5,
        this.barberId,
        this.selectedService.id
      )
      .subscribe({
        next: (res) => {
          // Step 1: Store populated slots
          this.populatedSlots = res;
          this.fetchedDate = this.selectedDate;

          // Step 2: Fetch bookings for that barber on that date
          this.bookingService
            .fetchBookings('barber', this.barberId, 1, 100)
            .subscribe({
              next: (bookingsRes) => {
                const bookedSlots = bookingsRes.data
                  .filter(
                    (b) =>
                      new Date(b.slotDetails.date)
                        .toISOString()
                        .split('T')[0] === this.selectedDate
                  )
                  .map(
                    (b) => `${b.slotDetails.startTime}-${b.slotDetails.endTime}`
                  );

                // Step 3: Mark populated slots as booked if they match
                for (const dateKey of Object.keys(this.populatedSlots)) {
                  this.populatedSlots[dateKey] = this.populatedSlots[
                    dateKey
                  ].map((slot) => ({
                    ...slot,
                    isBooked: bookedSlots.includes(
                      `${slot.startTime}-${slot.endTime}`
                    ),
                  }));
                }

                // Step 4: Open modal
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                const calendarModal = document.getElementById('bookingModal');
                if (calendarModal)
                  bootstrap.Modal.getInstance(calendarModal)?.hide();
                setTimeout(() => {
                  const slotModal = document.getElementById('slotTableModal');
                  if (slotModal) new bootstrap.Modal(slotModal).show();
                }, 200);
              },
              error: (err) => {
                console.error('Error fetching bookings:', err);
              },
            });
        },
        error: (err) => {
          Swal.fire(
            'Error!',
            err.error?.error || 'An unexpected error occurred',
            'error'
          );
        },
      });
  }

  getDates(slotObj: SlotResponse): string[] {
    return Object.keys(slotObj);
  }

  bookTimeSlot(slot: SlotTime, date: string): void {
    this.authService.userId$.subscribe((id) => {
      if (!id || !this.barberId || !this.selectedService) return;

      const bookingDate = new Date(date);

      const startTimeDate = new Date(bookingDate);
      startTimeDate.setHours(
        new Date(slot.startTime).getHours(),
        new Date(slot.startTime).getMinutes(),
        0,
        0
      );

      const endTimeDate = new Date(bookingDate);
      endTimeDate.setHours(
        new Date(slot.endTime).getHours(),
        new Date(slot.endTime).getMinutes(),
        0,
        0
      );

      const bookingData: BookingCreateRequestDto = {
        barberId: this.barberId,
        serviceId: this.selectedService.id,
        date: bookingDate,
        startTime: startTimeDate,
        endTime: endTimeDate,
        price: this.selectedService.price,
      };

      this.bookingService.bookSlot(id, bookingData).subscribe({
        next: (res) => Swal.fire('Success', res.message, 'success'),
        error: (err) =>
          Swal.fire(
            'Error',
            err.error?.error || 'Failed to book slot',
            'error'
          ),
      });
    });
  }
}
