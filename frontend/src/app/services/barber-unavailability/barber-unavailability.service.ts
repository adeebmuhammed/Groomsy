import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BarberUnavailabilityDto, IMessageResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BarberUnavailabilityService {

  private http = inject(HttpClient);

  fetchBarberUnavailability(barberId: string): Observable<BarberUnavailabilityDto> {
    return this.http.get<BarberUnavailabilityDto>(`${environment.apiBaseUrl}/barber/unavailability/${barberId}`);
  }

  editWeeklyDayOff(barberId: string, day: string): Observable<IMessageResponse> {
    return this.http.patch<IMessageResponse>(`${environment.apiBaseUrl}/barber/unavailability/weekly/${barberId}`, { day });
  }

  addOffDay(barberId: string, data: { date: string; reason: string }): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${environment.apiBaseUrl}/barber/unavailability/special/${barberId}`, data);
  }

  removeOffDay(barberId: string, date: string): Observable<IMessageResponse> {
    const params = new HttpParams().set('date', date);
    return this.http.delete<IMessageResponse>(`${environment.apiBaseUrl}/barber/unavailability/special/${barberId}`, { params });
  }
}
