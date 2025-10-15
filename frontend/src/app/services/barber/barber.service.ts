import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BarberProfileDto,
  DashboardStatsDto,
  EditProfile,
  IMessageResponse,
  IUser,
  PaginatedResponse,
} from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  private http = inject(HttpClient);

  fetchBarberProfile(barberId: string): Observable<BarberProfileDto> {
    return this.http.get<BarberProfileDto>(
      `${environment.apiBaseUrl}/barber/profile/${barberId}`
    );
  }

  updateBarberProfile(
    barberId: string,
    data: EditProfile
  ): Observable<IMessageResponse> {
    const body = data;
    return this.http.put<IMessageResponse>(
      `${environment.apiBaseUrl}/barber/profile/${barberId}`,
      body
    );
  }

  updateBarberAddress(
    barberId: string,
    data: BarberProfileDto['address']
  ): Observable<IMessageResponse> {
    const body = data;
    return this.http.patch<IMessageResponse>(
      `${environment.apiBaseUrl}/barber/profile/address/${barberId}`,
      body
    );
  }

  fetchUsers(
    search = '',
    page = 1,
    limit = 5
  ): Observable<PaginatedResponse<IUser>> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<PaginatedResponse<IUser>>(
      `${environment.apiBaseUrl}/barber/users`,
      {
        params,
      }
    );
  }

  getDashboardStats(
      filter: string,
      type: string,
      barberId: string
    ): Observable<DashboardStatsDto> {
      const params = new HttpParams().set('filter', filter).set('type', type);
      return this.http.get<DashboardStatsDto>(
        `${environment.apiBaseUrl}/barber/dashboard-stats/${barberId}`,
        { params }
      );
    }
}
