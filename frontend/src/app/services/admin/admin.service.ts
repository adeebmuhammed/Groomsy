import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  listUsers():Observable<any>{
    return this.http.get(`${environment.apiBaseUrl}/admin/users`,{ withCredentials: true })
  }

  listBarbers():Observable<any>{
    return this.http.get(`${environment.apiBaseUrl}/admin/barbers`,{ withCredentials: true })
  }

  updateUserStatus(userId: string, status: string) {
    return this.http.patch<{ message: string }>(`${environment.apiBaseUrl}/admin/update-user-status/${userId}`,{ status },{ withCredentials: true });
  }

  updateBarberStatus(barberId: string, status: string) {
    return this.http.patch<{ message: string }>(`${environment.apiBaseUrl}/admin/update-barber-status/${barberId}`,{ status },{ withCredentials: true });
  }
}
