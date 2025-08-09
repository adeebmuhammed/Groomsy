import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BookingCreateRequestDto,
  BookingResponseDto,
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
    console.log(page);
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

  bookSlot(userId: string, bookingData: BookingCreateRequestDto) {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<{ message: string }>(
      `${environment.apiBaseUrl}/user/bookings`,
      bookingData,
      {
        params,
        withCredentials: true,
      }
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
}
