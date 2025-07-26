import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SlotListResponseDto } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  constructor( private http: HttpClient) { }

  getSlotsByBarber(
    barberId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<SlotListResponseDto> {
    const params = new HttpParams()
    .set('barberId', barberId)
    .set('page', page.toString())
    .set('limit', limit.toString());
    
    return this.http.get<SlotListResponseDto>(`${environment.apiBaseUrl}/barber/slots`,
      {
        params,
        withCredentials: true,
      }
    );
  }

}
