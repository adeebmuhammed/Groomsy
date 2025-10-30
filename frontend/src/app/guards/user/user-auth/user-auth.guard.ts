import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userAuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  canActivate(): Observable<boolean> {
    return this.authService.isUserLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/user/signin']);
          return false;
        }
      })
    );
  }
}
