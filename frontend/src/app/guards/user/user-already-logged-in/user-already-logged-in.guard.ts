import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userAlreadyLoggedInGuard implements CanActivate {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  canActivate(): Observable<boolean> {
    return this.authService.isUserLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/user/home']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
