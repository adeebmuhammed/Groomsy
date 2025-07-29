import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BarberDto, PaginatedResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

getFavoriteBarbers(userId: string, page: number, limit: number): Observable<PaginatedResponse<BarberDto>> {
  const params = new HttpParams()
    .set('userId', userId)
    .set('page', page)
    .set('limit', limit);

  return this.http.get<PaginatedResponse<BarberDto>>(`${environment.apiBaseUrl}/user/favorites`, { params, withCredentials: true });
}

updateFavorite(userId: string, barberId: string): Observable<any> {
  const body = { userId, barberId };
  return this.http.patch<any>(
    `${environment.apiBaseUrl}/user/favorites`,
    body,
    { withCredentials: true }
  );
}

}