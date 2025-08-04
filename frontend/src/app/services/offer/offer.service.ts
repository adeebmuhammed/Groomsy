import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferListResponseDto, OfferRequestDto } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  getOffers(
      page: number,
      limit: number,
      searchTerm = ''
    ): Observable<OfferListResponseDto> {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        search: searchTerm,
      };
  
      return this.http.get<OfferListResponseDto>(
        `${environment.apiBaseUrl}/admin/offers`,
        { params, withCredentials: true }
      );
    }
  
    addOffer(
      data: OfferRequestDto
    ):Observable<{message: string}> {
      return this.http.post<{message: string}>(
        `${environment.apiBaseUrl}/admin/offers`,
        data,
        {withCredentials: true}
      )
    }
  
    editOffer(
      offerId: string,
      data: OfferRequestDto
    ):Observable<{message: string}> {
      return this.http.put<{message: string}>(
        `${environment.apiBaseUrl}/admin/offers/${offerId}`,
        data,
        {withCredentials: true}
      )
    }
  
    deleteOffer(
      offerId: string
    ):Observable<{message: string}> {
      return this.http.delete<{message: string}>(
        `${environment.apiBaseUrl}/admin/offers/${offerId}`,
        {withCredentials: true}
      )
    }
}
