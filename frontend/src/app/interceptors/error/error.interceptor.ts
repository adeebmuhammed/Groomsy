import {  inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { catchError, throwError, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        return http.post(`${environment.apiBaseUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
          switchMap(() => {
            // Retry original request
            return next(req);
          }),
          catchError((refreshError) => {
            // If refresh also fails, show message and reject
            snackBar.open('Session expired. Please login again.', 'Dismiss', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            return throwError(() => refreshError);
          })
        );
      }

      // Other error messages
      let message = 'An unknown error occurred';

      if (error.status === 0) {
        message = 'No connection. Please check your network.';
      } else if (error.status === 500) {
        message = 'Server error. Try again later.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      snackBar.open(message, 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      return throwError(() => error);
    })
  );
};