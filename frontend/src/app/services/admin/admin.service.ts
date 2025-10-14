import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IUser,
  IBarber,
  PaginatedResponse,
  AdminDashboardStatsDto,
} from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http: HttpClient = inject(HttpClient);

  listUsers(
    search = '',
    page = 1,
    limit = 5
  ): Observable<PaginatedResponse<IUser>> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<PaginatedResponse<IUser>>(
      `${environment.apiBaseUrl}/admin/users`,
      {
        params,
      }
    );
  }

  /**
   *
   * @param search
   * @param page
   * @param limit
   * @returns
   */
  listBarbers(
    search = '',
    page = 1,
    limit = 5
  ): Observable<PaginatedResponse<IBarber>> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<PaginatedResponse<IBarber>>(
      `${environment.apiBaseUrl}/admin/barbers`,
      {
        params,
      }
    );
  }
  /**
   *
   * @param userId
   * @param status
   * @returns
   */
  updateUserStatus(
    userId: string,
    status: string
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${environment.apiBaseUrl}/admin/update-user-status/${userId}`,
      { status }
    );
  }

  updateBarberStatus(
    barberId: string,
    status: string
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${environment.apiBaseUrl}/admin/update-barber-status/${barberId}`,
      { status }
    );
  }

  getDashboardStats(
    filter: string,
    type: string
  ): Observable<AdminDashboardStatsDto> {
    const params = new HttpParams().set('filter', filter).set('type', type);
    return this.http.get<AdminDashboardStatsDto>(
      `${environment.apiBaseUrl}/admin/dashboard-stats`,
      { params }
    );
  }
}
