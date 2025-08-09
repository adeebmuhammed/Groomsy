import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  IMessageResponse,
  ServiceListResponse,
} from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private http = inject(HttpClient);

  fetch(
    role: 'user' | 'admin',
    search: string = '',
    page: number = 1,
    limit: number = 5
  ): Observable<ServiceListResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<ServiceListResponse>(
      `${environment.apiBaseUrl}/${role}/service`,
      { params, withCredentials: true }
    );
  }

  create(data: {
    name: string;
    description: string;
    duration: string;
    price: number;
  }): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${environment.apiBaseUrl}/admin/service`,
      data,
      { withCredentials: true }
    );
  }

  edit(
    id: string,
    data: { name: string; description: string; duration: string; price: number }
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${environment.apiBaseUrl}/admin/service/${id}`,
      data,
      { withCredentials: true }
    );
  }

  delete(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(
      `${environment.apiBaseUrl}/admin/service/${id}`,
      { withCredentials: true }
    );
  }
}
