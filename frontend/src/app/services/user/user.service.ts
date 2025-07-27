import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BarberDto, PaginatedResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  fetchBarbers(search = '', page = 1, limit = 3):Observable<PaginatedResponse<BarberDto>>{
    
    const params = new HttpParams()
    .set('search', search)
    .set('page', page)
    .set('limit', limit);

    return this.http.get<PaginatedResponse<BarberDto>>(`${environment.apiBaseUrl}/user/get-barbers`,{
      params,
      withCredentials: true
    })
  }
}
