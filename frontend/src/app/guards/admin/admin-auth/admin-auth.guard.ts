import { CanActivate,Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable,map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class adminAuthGuard implements CanActivate{
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

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