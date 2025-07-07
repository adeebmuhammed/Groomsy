import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class userAuthGuard implements CanActivate{
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isUserLoggedIn$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/user/signin']);
          return false;
        }
      })
    );
  }
};