import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable,map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class barberAuthGuard implements CanActivate{
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
      return this.authService.isBarberLoggedIn$.pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            return true;
          } else {
            this.router.navigate(['/barber/signin']);
            return false;
          }
        })
      );
    }
};