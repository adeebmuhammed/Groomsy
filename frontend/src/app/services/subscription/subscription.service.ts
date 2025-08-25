import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessageResponse, SubscriptionDto,SubscriptionPlanDto,confirmSubscription } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private http = inject(HttpClient);

  getSubscriptionDetailsByBarber(barberId: string): Observable<SubscriptionDto> {
    return this.http.get<SubscriptionDto>(
      `${environment.apiBaseUrl}/barber/subscription/${barberId}`
    );
  }

  manageSubscription(barberId: string, planId: string): Observable<confirmSubscription> {
    return this.http.post<confirmSubscription>(
      `${environment.apiBaseUrl}/barber/subscription`,
      { barberId, planId }
    );
  }

  renewSubscription(barberId: string): Observable<confirmSubscription> {
    return this.http.put<confirmSubscription>(
      `${environment.apiBaseUrl}/barber/subscription`,
      { barberId }
    );
  }

  verifySubscriptionPayment(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    barberId: string
  ): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${environment.apiBaseUrl}/barber/subscription/verify-payment`,
      { razorpay_payment_id, razorpay_order_id, razorpay_signature, barberId }
    );
  }

  fetchPlans():Observable<SubscriptionPlanDto[]>{
    return this.http.get<SubscriptionPlanDto[]>(`${environment.apiBaseUrl}/barber/subscription/plans`)
  }
}
