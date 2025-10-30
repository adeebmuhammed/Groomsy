import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { BookingService } from '../../../services/booking/booking.service';
import {
  BarberDto,
  BookingResponseDto,
  BookingStatus,
  ReviewCreateRequestDto,
  ReviewResponseDto,
  Service,
} from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReviewService } from '../../../services/review/review.service';
import { ReviewFormComponent } from '../../../components/shared/review-form/review-form.component';
import { Router } from '@angular/router';
import { CheckoutModalComponent } from '../../../components/shared/checkout-modal/checkout-modal.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { ServiceService } from '../../../services/service/service.service';
import * as bootstrap from 'bootstrap';
import { BookingDetailsComponent } from '../../../components/shared/booking-details/booking-details.component';
import { ROLES } from '../../../constants/roles';

@Component({
  selector: 'app-user-booking',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    CommonModule,
    FormsModule,
    DatePipe,
    ReviewFormComponent,
    CheckoutModalComponent,
    BookingDetailsComponent,
  ],
  templateUrl: './user-booking.component.html',
  styleUrl: './user-booking.component.css',
})
export class UserBookingComponent implements OnInit, OnDestroy {
  bookings: BookingResponseDto[] = [];
  selectedBooking: BookingResponseDto | null = null;
  selectedService: Service | null = null;
  barbers: BarberDto[] = [];
  reviewsByUser: ReviewResponseDto[] | [] = [];
  selectedSort: 'newest' | 'oldest' | 'price_low' | 'price_high' = 'newest';
  statuses: { label: string; value: BookingStatus }[] = [
    { label: 'Upcoming', value: 'pending' },
    { label: 'Completed', value: 'finished' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Staged', value: 'staged' },
  ];

  selectedStatus: BookingStatus = 'pending';
  reviewModalVisible = false;
  selectedBookingId: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pages: number[] = [];

  stagedBooking: BookingResponseDto | null = null;
  checkoutData: { barber?: BarberDto; service?: Service } = {};

  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private userService = inject(UserService);
  private serviceService = inject(ServiceService);

  openStagedBooking(booking: BookingResponseDto) {
    this.stagedBooking = booking;

    forkJoin({
      barberRes: this.userService.fetchBarbers('', 1, 100),
      serviceRes: this.serviceService.fetch(ROLES.USER, '', 1, 100),
    }).subscribe(({ barberRes, serviceRes }) => {
      this.checkoutData.barber = barberRes.data.find(
        (b) => b.id === booking.barber
      );
      this.checkoutData.service = serviceRes.data.find(
        (s) => s.id === booking.service
      );
    });
  }

  ngOnInit(): void {
    this.fetchBookingsByStatus(this.selectedStatus, this.selectedSort);
    this.fetchBarbers();
    this.fetchReviews()
  }

  reviewCheck(bookingId: string){
    return this.reviewsByUser.find(b => b.booking === bookingId)
  }

  fetchReviews(){
    this.authService.userId$.pipe(takeUntil(this.componentDestroyed$)).subscribe((id)=>{
      if (!id) {
        return;
      }
      this.reviewService.getAllReviewsByUser(id,1,100).pipe(takeUntil(this.componentDestroyed$)).subscribe({
        next: (res) => {
          this.reviewsByUser = res.data
        },
        error: (err)=>{
          console.error(err)
        }
      })
    })
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

   applySort(){
    this.fetchBookingsByStatus( this.selectedStatus, this.selectedSort)
  }

  fetchBarbers(): void {
    this.userService
      .fetchBarbers('', 1, 100)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.barbers = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  findBarber(barberId: string) {
    const barber = this.barbers.find((b) => b.id === barberId);
    return barber?.name || null;
  }

  private generatePages(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchBookingsByStatus(
    status: 'pending' | 'staged' | 'cancelled' | 'finished',
    sort: 'newest' | 'oldest' | 'price_low' | 'price_high',
    page = 1
  ): void {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) return;

        this.bookingService
          .getBookingByStatus(id, status, sort, page, this.itemsPerPage, ROLES.USER)
          .pipe(takeUntil(this.componentDestroyed$))
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
    this.selectedSort = "newest";
    this.currentPage = 1;
    this.fetchBookingsByStatus(status,this.selectedSort, 1);
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.fetchBookingsByStatus(this.selectedStatus, this.selectedSort, page);
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
          .updateBookingStatus(ROLES.USER, booking.id, 'cancel')
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              Swal.fire('Cancelled!', 'Booking has been cancelled.', 'success');
              this.fetchBookingsByStatus(this.selectedStatus, this.selectedSort);
            },
            error: (err) => {
              console.error('Delete error:', err);
              Swal.fire('Error!', 'Failed to cancel the booking.', 'error');
            },
          });
      }
    });
  }

  couponApllication(couponCode: string) {
    if (!this.stagedBooking?.id) {
      Swal.fire('Error', 'No booking found to apply coupon', 'error');
      return;
    }

    this.bookingService
      .couponApplication(this.stagedBooking.id, couponCode)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (updatedBooking) => {
          this.stagedBooking = updatedBooking;

          forkJoin({
            barberRes: this.userService.fetchBarbers('', 1, 100),
            serviceRes: this.serviceService.fetch(ROLES.USER, '', 1, 100),
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

  retryPayment(bookingId: string, couponCode?: string) {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id || !bookingId) return;

        this.bookingService
          .confirmBooking(id, bookingId, { couponCode: couponCode || '' })
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              const { keyId, amount, currency, orderId, bookingId } = res;

              const options: any = {
                key: keyId,
                amount: amount.toString(),
                currency,
                name: 'Groomsy',
                description: 'Booking Payment',
                order_id: orderId,
                handler: (paymentResponse: any) => {
                  this.bookingService
                    .verifyPayment({
                      razorpay_payment_id: paymentResponse.razorpay_payment_id,
                      razorpay_order_id: paymentResponse.razorpay_order_id,
                      razorpay_signature: paymentResponse.razorpay_signature,
                      bookingId,
                    })
                    .pipe(takeUntil(this.componentDestroyed$))
                    .subscribe({
                      next: () => {
                        this.router.navigate([
                          `/user/booking-confirmation/${bookingId}`,
                        ]);
                      },
                      error: () => {
                        this.router.navigate([
                          `/user/booking-confirmation/${bookingId}`,
                        ]);
                      },
                    });
                },
                theme: { color: '#3399cc' },
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

  leaveReview(booking: BookingResponseDto) {
    this.selectedBookingId = booking.id;
    this.reviewModalVisible = true;
  }

  handleReviewSubmit(review: ReviewCreateRequestDto) {
    if (!this.selectedBookingId) return;

    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id || !this.selectedBookingId) {
          return;
        }
        this.reviewService
          .createReview(id, this.selectedBookingId, review)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              Swal.fire(
                'Thank you!',
                'Your review has been submitted.',
                'success'
              );
              this.reviewModalVisible = false;
              this.selectedBookingId = null;
              this.fetchReviews()
            },
            error: () => {
              Swal.fire('Error!', 'Failed to submit review.', 'error');
            },
          });
      });
  }

  openDetailsModal(booking: BookingResponseDto): void {
    this.selectedBooking = booking;
    this.serviceService
      .getServiceById(ROLES.ADMIN, booking.service)
      .pipe(takeUntil(this.componentDestroyed$))
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

  formatTimeUTC(dateStr: Date): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  }
}
