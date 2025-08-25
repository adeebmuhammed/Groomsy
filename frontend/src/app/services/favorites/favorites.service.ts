import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BarberDto,
  IMessageResponse,
  PaginatedResponse,
} from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(private http: HttpClient) {}

  getFavoriteBarbers(
    userId: string,
    page: number,
    limit: number
  ): Observable<PaginatedResponse<BarberDto>> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<PaginatedResponse<BarberDto>>(
      `${environment.apiBaseUrl}/user/favorites`,
      { params, }
    );
  }

  updateFavorite(
    userId: string,
    barberId: string
  ): Observable<IMessageResponse> {
    const body = { userId, barberId };
    return this.http.patch<IMessageResponse>(
      `${environment.apiBaseUrl}/user/favorites`,
      body,
    );
  }
}
