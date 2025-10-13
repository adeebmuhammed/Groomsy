import { Component, inject, NgZone, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import {
  confirmSubscription,
  SubscriptionDto,
  SubscriptionPlanDto,
} from '../../../interfaces/interfaces';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { SubscriptionPlanService } from '../../../services/subscription-plan/subscription-plan.service';

@Component({
  selector: 'app-barber-subscription',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    CommonModule,
  ],
  templateUrl: './barber-subscription.component.html',
  styleUrl: './barber-subscription.component.css',
})
export class BarberSubscriptionComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthService);
  private planService = inject(SubscriptionPlanService);
  private ngZone = inject(NgZone);

  subscription: SubscriptionDto | null = null;
  plan: SubscriptionPlanDto | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.loadSubscription(id);
      }
    });
  }

  loadSubscription(barberId: string) {
    this.subscriptionService
      .getSubscriptionDetailsByBarber(barberId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.subscription = res;
          this.loading = false;
          this.planService
            .getPlanById(this.subscription.plan)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                this.plan = res;
              },
              error: (err) => {
                this.error = err.message || 'Failed to fetch subscription plan';
                this.loading = false;
              },
            });
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch subscription';
          this.loading = false;
        },
      });
  }

  isExpired(): boolean {
    if (!this.subscription) return false;
    const today = new Date();
    return new Date(this.subscription.expiryDate) < today;
  }

  subscribe(planId: string) {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) return;

      this.subscriptionService
        .manageSubscription(id, planId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            const { keyId, amount, currency, orderId, message } = res;

            const options: any = {
              key: keyId,
              amount: amount.toString(),
              currency: currency,
              name: 'Groomsy',
              description: 'Subscription Payment',
              order_id: orderId,
              handler: (paymentResponse: any) => {
                this.subscriptionService
                  .verifySubscriptionPayment(
                    paymentResponse.razorpay_payment_id,
                    paymentResponse.razorpay_order_id,
                    paymentResponse.razorpay_signature,
                    id // barberId
                  )
                  .subscribe({
                    next: () => {
                      Swal.fire(
                        'Success',
                        'Retry Payment Successfully',
                        'success'
                      ).then(() => {
                        this.ngZone.run(() => {
                          this.loadSubscription(id);
                        });
                      });
                    },
                    error: (err) => {
                      Swal.fire(
                        'Error',
                        'Payment verification failed',
                        'error'
                      );
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
              err.error?.error || 'Subscription initiation failed',
              'error'
            );
          },
        });
    });
  }

  renew() {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) return;

      this.subscriptionService.renewSubscription(id).subscribe({
        next: (res) => {
          const { keyId, amount, currency, orderId, message } = res;

          const options: any = {
            key: keyId,
            amount: amount.toString(),
            currency: currency,
            name: 'Groomsy',
            description: 'Subscription Renewal',
            order_id: orderId,
            handler: (paymentResponse: any) => {
              this.subscriptionService
                .verifySubscriptionPayment(
                  paymentResponse.razorpay_payment_id,
                  paymentResponse.razorpay_order_id,
                  paymentResponse.razorpay_signature,
                  id // barberId
                )
                .pipe(take(1))
                .subscribe({
                  next: () => {
                    Swal.fire(
                      'Success',
                      'Retry Payment Successfully',
                      'success'
                    ).then(() => {
                      this.ngZone.run(() => {
                        this.loadSubscription(id);
                      });
                    });
                  },
                  error: (err) => {
                    alert(err.error?.error || 'Payment verification failed');
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
            err.error?.error || 'Renewal initiation failed',
            'error'
          );
        },
      });
    });
  }

  retryPayment(planId: string) {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id || !planId) return;

      this.subscriptionService
        .manageSubscription(id, planId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            const { keyId, amount, currency, orderId } = res;

            const options: any = {
              key: keyId,
              amount: amount.toString(),
              currency,
              name: 'Groomsy',
              description: 'Retry Subscription Payment',
              order_id: orderId,
              handler: (paymentResponse: any) => {
                this.subscriptionService
                  .verifySubscriptionPayment(
                    paymentResponse.razorpay_payment_id,
                    paymentResponse.razorpay_order_id,
                    paymentResponse.razorpay_signature,
                    id
                  )
                  .pipe(take(1))
                  .subscribe({
                    next: () =>
                      Swal.fire(
                        'Success',
                        'Subscription Payment Completed Successfully',
                        'success'
                      ).then(() => {
                        this.ngZone.run(() => {
                          this.loadSubscription(id);
                        });
                      }),
                    error: (err) =>
                      Swal.fire(
                        'Error',
                        err.error?.error || 'Payment verification failed',
                        'error'
                      ),
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
              err.error?.error || 'Retry initiation failed',
              'error'
            );
          },
        });
    });
  }

  plans: SubscriptionPlanDto[] = [];

  openPlansModal() {
    this.subscriptionService
      .fetchPlans()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.plans = res;
          const modal = new (window as any).bootstrap.Modal(
            document.getElementById('plansModal')
          );
          modal.show();
        },
        error: (err) => alert(err.message || 'Failed to load plans'),
      });
  }

  confirmSubscription(planId: string) {
    this.subscribe(planId);
  }
}
