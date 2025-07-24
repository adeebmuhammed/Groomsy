import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser,IBarber,PaginatedResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  listUsers(search = '', page = 1, limit = 5): Observable<PaginatedResponse<IUser>> {
  const params = new HttpParams()
    .set('search', search)
    .set('page', page)
    .set('limit', limit);

  return this.http.get<PaginatedResponse<IUser>>(`${environment.apiBaseUrl}/admin/users`, {
    params,
    withCredentials: true
  });
}


  listBarbers(search = '', page = 1, limit = 5):Observable<PaginatedResponse<IBarber>>{
    const params = new HttpParams()
    .set('search', search)
    .set('page', page)
    .set('limit', limit);

    return this.http.get<PaginatedResponse<IBarber>>(`${environment.apiBaseUrl}/admin/barbers`,{
      params,
      withCredentials: true 
    })
  }

  updateUserStatus(userId: string, status: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${environment.apiBaseUrl}/admin/update-user-status/${userId}`,{ status },{ withCredentials: true });
  }

  updateBarberStatus(barberId: string, status: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${environment.apiBaseUrl}/admin/update-barber-status/${barberId}`,{ status },{ withCredentials: true });
  }
}