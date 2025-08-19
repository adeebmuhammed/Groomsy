import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSubscriptionPlanDto, IMessageResponse, PlanListResponse } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {

  private http = inject(HttpClient)

  fetch(search = '', page = 1, limit = 5): Observable<PlanListResponse>{
    const params = new HttpParams()
    .set('search', search)
    .set('page', page)
    .set('limit', limit)

    return this.http.get<PlanListResponse>(`${environment.apiBaseUrl}/admin/subscription`,{ params, withCredentials: true })
  }

  create(data: CreateSubscriptionPlanDto): Observable<IMessageResponse>{
    return this.http.post<IMessageResponse>(`${environment.apiBaseUrl}/admin/subscription`,data, { withCredentials: true })
  }

  updateActivation(planId: string): Observable<IMessageResponse>{
    return this.http.patch<IMessageResponse>(`${environment.apiBaseUrl}/admin/subscription/${planId}`,{},{ withCredentials: true })
  }
}
