import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BarberDto,
  EditProfile,
  IMessageResponse,
  PaginatedResponse,
  SlotListResponseDto,
  SlotResponse,
  UserProfileDto,
} from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  fetchBarbers(
    search = '',
    page = 1,
    limit = 3,
    district = ''
  ): Observable<PaginatedResponse<BarberDto>> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    if (district) {
      params = params.set('district', district);
    }

    return this.http.get<PaginatedResponse<BarberDto>>(
      `${environment.apiBaseUrl}/user/get-barbers`,
      {
        params,
      }
    );
  }

  fetchSlotRulesByBarber(
    barberId: string,
    page = 1,
    limit = 5
  ): Observable<SlotListResponseDto> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<SlotListResponseDto>(
      `${environment.apiBaseUrl}/user/get-barber-slots/${barberId}`,
      { params, withCredentials: true }
    );
  }

  fetchPopulatedSlots(
    date: string,
    page: number,
    limit: number,
    barberId: string,
    serviceId: string
  ): Observable<SlotResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('date', date)
      .set('serviceId', serviceId);
    return this.http.get<SlotResponse>(
      `${environment.apiBaseUrl}/user/populated-slots/${barberId}`,
      { params }
    );
  }

  fetchUserProfile(userId: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(
      `${environment.apiBaseUrl}/user/profile/${userId}`
    );
  }

  updateUserProfile(
    userId: string,
    data: EditProfile
  ): Observable<IMessageResponse> {
    const body = data;
    return this.http.put<IMessageResponse>(
      `${environment.apiBaseUrl}/user/profile/${userId}`,
      body
    );
  }
}
