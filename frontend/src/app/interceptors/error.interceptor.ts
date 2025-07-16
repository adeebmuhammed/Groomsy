import {  inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unknown error occurred';

      if (error.status === 0) {
        message = 'No connection. Please check your network.';
      } else if (error.status === 401) {
        message = 'Unauthorized! Please login.';
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