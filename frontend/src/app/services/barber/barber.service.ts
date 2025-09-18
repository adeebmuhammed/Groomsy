import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberProfileDto, EditProfile, IMessageResponse } from '../../interfaces/interfaces';
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

  updateBarberProfile(barberId: string, data: EditProfile): Observable<IMessageResponse>{
    const body = data;
    return this.http.put<IMessageResponse>(
      `${environment.apiBaseUrl}/barber/profile/${barberId}`,
      body
    );
  }
}
