import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CouponListResponseDto, CouponRequestDto } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  constructor(private http: HttpClient) {}

  getCoupons(
    page: number,
    limit: number,
    searchTerm: string = ''
  ): Observable<CouponListResponseDto> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      search: searchTerm,
    };

    return this.http.get<CouponListResponseDto>(
      `${environment.apiBaseUrl}/admin/coupons`,
      { params, withCredentials: true }
    );
  }

  addCoupon(
    data: CouponRequestDto
  ):Observable<{message: string}> {
    return this.http.post<{message: string}>(
      `${environment.apiBaseUrl}/admin/coupons`,
      data,
      {withCredentials: true}
    )
  }

  editCoupon(
    couponId: string,
    data: CouponRequestDto
  ):Observable<{message: string}> {
    return this.http.put<{message: string}>(
      `${environment.apiBaseUrl}/admin/coupons/${couponId}`,
      data,
      {withCredentials: true}
    )
  }

  deleteCoupon(
    couponId: string
  ):Observable<{message: string}> {
    return this.http.delete<{message: string}>(
      `${environment.apiBaseUrl}/admin/coupons/${couponId}`,
      {withCredentials: true}
    )
  }
}
