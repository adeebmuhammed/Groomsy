import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BookingCreateRequestDto,
  BookingResponseDto,
  confirmBookingDto,
  confirmData,
  IMessageResponse,
} from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ROLES } from '../../constants/roles';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http: HttpClient = inject(HttpClient);

  fetchBookings(
    role: ROLES,
    id: string,
    page: number,
    limit: number
  ): Observable<{ data: BookingResponseDto[]; totalCount: number }> {
    const params = new HttpParams()
      .set('role', role)
      .set('id', id)
      .set('page', page?.toString() || '1')
      .set('limit', limit?.toString() || '5');

    return this.http.get<{ data: BookingResponseDto[]; totalCount: number }>(
      `${environment.apiBaseUrl}/${role}/bookings`,
      { params }
    );
  }

  stageBooking(
    userId: string,
    bookingData: BookingCreateRequestDto
  ): Observable<BookingResponseDto> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<BookingResponseDto>(
      `${environment.apiBaseUrl}/user/bookings/stage`,
      bookingData,
      {
        params,
      }
    );
  }

  couponApplication(
    bookingId: string,
    couponCode: string
  ): Observable<BookingResponseDto> {
    const params = new HttpParams().set('bookingId', bookingId);
    return this.http.put<BookingResponseDto>(
      `${environment.apiBaseUrl}/user/bookings/coupon`,
      { couponCode },
      { params }
    );
  }

  confirmBooking(
    userId: string,
    bookingId: string,
    confirmData: confirmData
  ): Observable<confirmBookingDto> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('bookingId', bookingId);

    return this.http.post<confirmBookingDto>(
      `${environment.apiBaseUrl}/user/bookings/confirm`,
      confirmData,
      {
        params,
      }
    );
  }

  verifyPayment(paymentData: any): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${environment.apiBaseUrl}/user/bookings/verify-payment`,
      paymentData
    );
  }

  updateBookingStatus(
    role: ROLES,
    id: string,
    bookingStatus: string
  ): Observable<IMessageResponse> {
    const params = new HttpParams().set('role', role);
    const body = { bookingStatus };
    return this.http.patch<IMessageResponse>(
      `${environment.apiBaseUrl}/${role}/bookings/${id}`,
      body,
      { params }
    );
  }

  getBookingById(role: ROLES, bookingId: string) {
    return this.http.get<BookingResponseDto>(
      `${environment.apiBaseUrl}/${role}/bookings-by-id/${bookingId}`
    );
  }

  getBookingByStatus(
    userId: string | null,
    status: 'pending' | 'staged' | 'cancelled' | 'finished',
    filter: 'newest' | 'oldest' | 'price_low' | 'price_high',
    page = 1,
    limit = 5,
    role: ROLES
  ): Observable<{ data: BookingResponseDto[]; totalCount: number }> {
    let params = new HttpParams()
      .set('status', status)
      .set('filter', filter)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('role', role);

    if (userId && role !== 'admin') {
      params = params.set('id', userId);
    }

    return this.http.get<{ data: BookingResponseDto[]; totalCount: number }>(
      `${environment.apiBaseUrl}/${role}/bookings`,
      { params }
    );
  }

  getBookingsByBarber(
    barberId: string
  ): Observable<{ data: BookingResponseDto[]; totalCount: number }> {
    return this.http.get<{ data: BookingResponseDto[]; totalCount: number }>(
      `${environment.apiBaseUrl}/user/bookings-by-barber/${barberId}`
    );
  }

  checkBeforePayment(bookingId: string): Observable<IMessageResponse> {
    const body = { bookingId };
    return this.http.patch<IMessageResponse>(
      `${environment.apiBaseUrl}/user/booking-check`,
      body
    );
  }
}
