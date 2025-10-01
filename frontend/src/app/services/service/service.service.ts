import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  IMessageResponse,
  Service,
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
    search = '',
    page = 1,
    limit = 5
  ): Observable<ServiceListResponse> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<ServiceListResponse>(
      `${environment.apiBaseUrl}/${role}/service`,
      { params }
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
    );
  }

  edit(
    id: string,
    data: { name: string; description: string; duration: string; price: number }
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${environment.apiBaseUrl}/admin/service/${id}`,
      data,
    );
  }

  delete(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(
      `${environment.apiBaseUrl}/admin/service/${id}`,
    );
  }

  getServiceById(
    role: 'user' | 'barber' | 'admin',
    serviceId: string
  ): Observable<Service> {
    return this.http.get<Service>(
      `${environment.apiBaseUrl}/${role}/service/${serviceId}`,
    );
  }
}
