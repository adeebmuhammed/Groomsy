import { CanActivate,Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable,map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn:'root'
})

export class adminAlreadyLoggedInGuard implements CanActivate{
  constructor(private router: Router, private authService: AuthService){}
  canActivate(): Observable<boolean> {
      return this.authService.isAdminLoggedIn$.pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            this.router.navigate(['/admin/dashboard']);
            return false;
          } else { 
            return true;
          }
        })
      );
    }
};
