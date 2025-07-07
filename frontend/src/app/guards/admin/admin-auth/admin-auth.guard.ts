import { CanActivate,Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable,map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class adminAuthGuard implements CanActivate{
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAdminLoggedIn$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/admin/signin']);
          return false;
        }
      })
    );
  }
};