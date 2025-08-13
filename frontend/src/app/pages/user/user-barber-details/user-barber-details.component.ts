import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import {
  BarberDto,
  BarberUnavailabilityDto,
  BookingCreateRequestDto,
  BookingResponseDto,
  IBarber,
  Service,
  SlotDto,
  SlotResponse,
  SlotTime,
} from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CheckoutModalComponent } from '../../../components/shared/checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-user-barber-details',
  imports: [
    CommonModule,
    UserHeaderComponent,
    UserFooterComponent,
    FormsModule,
    SlotTableModalComponent,
    ServiceCardComponent,
    CheckoutModalComponent,
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
  stagedBooking: BookingResponseDto | null = null;
  checkoutData: { barber?: BarberDto; service?: Service } = {
    barber: undefined,
    service: undefined,
  };

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private activatedRoute = inject(ActivatedRoute);
  private serviceService = inject(ServiceService);
  private barberUnavailabilityService = inject(BarberUnavailabilityService);
  private router = inject(Router);

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
    console.log('submit date called');
    if (!this.selectedDate || !this.selectedService) {
      Swal.fire('Error!', 'Please select a service and date.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (this.selectedDate < today) {
      Swal.fire('Warning!', 'Please select a future date.', 'warning');
      return;
    }

    const isoSelected = this.selectedDate;

    this.userService
      .fetchPopulatedSlots(
        isoSelected,
        1,
        5,
        this.barberId,
        this.selectedService.id
      )
      .subscribe({
        next: (res) => {
          this.populatedSlots = res;
          this.fetchedDate = isoSelected;

          this.bookingService
            .fetchBookings('barber', this.barberId, 1, 100)
            .subscribe({
              next: (bookingsRes) => {
                const bookingsForDate = bookingsRes.data.filter(
                  (b) =>
                    new Date(b.slotDetails.date).toISOString().split('T')[0] ===
                    isoSelected
                );

                if (!this.populatedSlots[isoSelected]) {
                  console.warn(
                    'No populated slots for',
                    isoSelected,
                    this.populatedSlots
                  );
                } else {
                  this.populatedSlots[isoSelected] = this.populatedSlots[
                    isoSelected
                  ].map((slot) => {
                    const slotStart = new Date(slot.startTime).getTime();
                    const slotEnd = new Date(slot.endTime).getTime();

                    const isBooked = bookingsForDate.some((b) => {
                      const bookedStart = new Date(
                        b.slotDetails.startTime
                      ).getTime();
                      const bookedEnd = new Date(
                        b.slotDetails.endTime
                      ).getTime();

                      if (isNaN(bookedStart) || isNaN(bookedEnd)) {
                        console.warn('Bad booking time for booking', b);
                        return false;
                      }

                      const adjustedBookedEnd =
                        bookedEnd === bookedStart ? bookedStart + 1 : bookedEnd;

                      const overlap =
                        bookedStart < slotEnd && adjustedBookedEnd > slotStart;
                      return overlap;
                    });

                    return { ...slot, isBooked };
                  });
                }

                if (document.activeElement instanceof HTMLElement)
                  document.activeElement.blur();
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

      this.bookingService.stageBooking(id, bookingData).subscribe({
        next: (res) => {
          this.stagedBooking = res;

          this.userService.fetchBarbers('', 1, 100).subscribe((barberRes) => {
            const barberDoc = barberRes.data.find(
              (b) => b.id === this.stagedBooking!.barber
            );

            this.serviceService
              .fetch('user', '', 1, 100)
              .subscribe((serviceRes) => {
                const serviceDoc = serviceRes.data.find(
                  (s) => s.id === this.stagedBooking!.service
                );

                this.checkoutData = {
                  ...this.stagedBooking!,
                  barber: barberDoc || undefined,
                  service: serviceDoc || undefined,
                };

                const modal = new bootstrap.Modal(
                  document.getElementById('bookingCheckoutModal')!
                );
                modal.show();
              });
          });
        },
        error: (err) =>
          Swal.fire(
            'Error',
            err.error?.error || 'Failed to stage booking',
            'error'
          ),
      });
    });
  }

  confirmBooking(couponCode: string) {
    if (!this.stagedBooking) return;

    this.authService.userId$.subscribe((id) => {
      if (!id || !this.stagedBooking?.id) return;

      this.bookingService
        .confirmBooking(id, this.stagedBooking.id, { couponCode })
        .subscribe({
          next: (res) => {
            const { keyId, amount, currency, orderId, bookingId } = res;

            const options: any = {
              key: keyId,
              amount: amount.toString(),
              currency: currency,
              name: 'Groomsy',
              description: 'Booking Payment',
              order_id: orderId,
              handler: (paymentResponse: any) => {
                this.bookingService
                  .verifyPayment({
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    bookingId: bookingId,
                  })
                  .subscribe({
                    next: (verifyRes) => {
                      this.router.navigate([
                        `/user/booking-confirmation/${bookingId}`,
                      ]);
                    },
                    error: (err) => {
                      this.router.navigate([
                        `/user/booking-confirmation/${bookingId}`,
                      ]);
                    },
                  });
              },
              theme: {
                color: '#3399cc',
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err.error?.error || 'Failed to confirm booking',
              'error'
            );
          },
        });
    });
  }

  cancelBooking() {
    const modal = new bootstrap.Modal(
      document.getElementById('bookingCheckoutModal')!
    );
    modal.hide();
  }

  couponApllication(couponCode: string) {
    if (!this.stagedBooking?.id) {
      Swal.fire('Error', 'No booking found to apply coupon', 'error');
      return;
    }

    this.bookingService
      .couponApplication(this.stagedBooking.id, couponCode)
      .subscribe({
        next: (updatedBooking) => {
          this.stagedBooking = updatedBooking;

          forkJoin({
            barberRes: this.userService.fetchBarbers('', 1, 100),
            serviceRes: this.serviceService.fetch('user', '', 1, 100),
          }).subscribe(({ barberRes, serviceRes }) => {
            const barberDoc = barberRes.data.find(
              (b) => b.id === updatedBooking.barber
            );
            const serviceDoc = serviceRes.data.find(
              (s) => s.id === updatedBooking.service
            );

            this.checkoutData = {
              barber: barberDoc || undefined,
              service: serviceDoc || undefined,
            };

            Swal.fire('Success', 'Coupon applied successfully!', 'success');
          });
        },
        error: (err) => {
          Swal.fire(
            'Error',
            err.error?.error || 'Failed to apply coupon',
            'error'
          );
        },
      });
  }
}
