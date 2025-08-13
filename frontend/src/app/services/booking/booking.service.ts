import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BookingCreateRequestDto,
  BookingResponseDto,
  confirmBookingDto,
  confirmData,
  IMessageResponse,
} from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  fetchBookings(
    role: 'user' | 'barber' | 'admin',
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
      { params, withCredentials: true }
    );
  }

  // Stage booking before checkout
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
        withCredentials: true,
      }
    );
  }

  couponApplication(
    bookingId: string,
    couponCode: string
  ): Observable<BookingResponseDto> {
    const params = new HttpParams().set('bookingId', bookingId);
    const body = { couponCode };
    return this.http.put<BookingResponseDto>(
      `${environment.apiBaseUrl}/user/bookings/coupon`,
      { couponCode },
      { params, withCredentials: true }
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
        withCredentials: true,
      }
    );
  }

  verifyPayment(paymentData: any): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${environment.apiBaseUrl}/user/bookings/verify-payment`,
      paymentData,
      { withCredentials: true }
    );
  }

  updateBookingStatus(
    role: 'user' | 'barber' | 'admin',
    id: string,
    bookingStatus: string
  ): Observable<IMessageResponse> {
    const params = new HttpParams().set('role', role);
    const body = { bookingStatus };
    return this.http.patch<IMessageResponse>(
      `${environment.apiBaseUrl}/${role}/bookings/${id}`,
      body,
      { params, withCredentials: true }
    );
  }

  getBookingById(role: 'user' | 'barber' | 'admin', bookingId: string) {
    return this.http.get<BookingResponseDto>(
      `${environment.apiBaseUrl}/${role}/bookings-by-id/${bookingId}`,
      { withCredentials: true }
    );
  }

  getBookingByStatus(
    userId: string,
    status: 'pending' | 'staged' | 'cancelled' | 'finished',
    page = 1,
    limit = 5
  ): Observable<{ data: BookingResponseDto[]; totalCount: number }> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page?.toString() || '1')
      .set('limit', limit?.toString() || '5');

    return this.http.get<{ data: BookingResponseDto[]; totalCount: number }>(
      `${environment.apiBaseUrl}/user/bookings/${userId}`,
      { params, withCredentials: true }
    );
  }
}
