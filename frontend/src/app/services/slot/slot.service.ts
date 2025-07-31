import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SlotDto, SlotListResponseDto } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  constructor(private http: HttpClient) {}

  getSlotsByBarber(
    barberId: string,
    page = 1,
    limit = 10
  ): Observable<SlotListResponseDto> {
    const params = new HttpParams()
      .set('barberId', barberId)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<SlotListResponseDto>(
      `${environment.apiBaseUrl}/barber/slots`,
      {
        params,
        withCredentials: true,
      }
    );
  }
  createSlot(
    barberId: string,
    data: SlotDto
  ): Observable<{ response: SlotDto; message: string }> {
    const params = new HttpParams().set('barberId', barberId);
    return this.http.post<{ response: SlotDto; message: string }>(
      `${environment.apiBaseUrl}/barber/slots`,
      data,
      { params, withCredentials: true }
    );
  }

  updateSlot(
    slotId: string,
    data: SlotDto
  ): Observable<{ response: SlotDto; message: string }> {
    return this.http.put<{ response: SlotDto; message: string }>(
      `${environment.apiBaseUrl}/barber/slots/${slotId}`,
      data,
      { withCredentials: true }
    );
  }

  deleteSlot(slotId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.apiBaseUrl}/barber/slots/${slotId}`,
      { withCredentials: true }
    );
  }
}
