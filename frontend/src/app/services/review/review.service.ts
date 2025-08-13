import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IMessageResponse,
  ReviewCreateRequestDto,
  ReviewListResponse,
} from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);

  getAllReviewsByUser(
    userId: string,
    page = 1,
    limit = 5
  ): Observable<ReviewListResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ReviewListResponse>(
      `${environment.apiBaseUrl}/user/review/${userId}`,
      { params, withCredentials: true }
    );
  }

  createReview(
    userId: string,
    bookingId: string,
    data: ReviewCreateRequestDto
  ): Observable<IMessageResponse> {
    const body = data;
    const params = new HttpParams()
      .set('userId', userId)
      .set('bookingId', bookingId);

    return this.http.post<IMessageResponse>(
      `${environment.apiBaseUrl}/user/review`,
      body,
      { params, withCredentials: true }
    );
  }

  deleteReview(reviewId: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(
      `${environment.apiBaseUrl}/user/review/${reviewId}`,
      { withCredentials : true}
    );
  }
}
