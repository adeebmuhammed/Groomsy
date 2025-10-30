import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable, map } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class barberAlreadyLoggedInGuard implements CanActivate {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  canActivate(): Observable<boolean> {
    return this.authService.isBarberLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/barber/dashboard']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
