import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IMessageResponse } from '../../../interfaces/interfaces';
import { BARBER_ROUTES_PATHS } from '../../../constants/barber-route.constant';

@Component({
  selector: 'app-barber-header',
  imports: [CommonModule],
  templateUrl: './barber-header.component.html',
  styleUrl: './barber-header.component.css',
})
export class BarberHeaderComponent implements OnInit {
  isLoggedIn = false;
  barberName: string | null = null;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.authService.isBarberLoggedIn$.pipe(take(1)).subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.authService.barberName$.pipe(take(1)).subscribe((name) => {
      this.barberName = name;
    });
  }

  handleAuth(): void {
    if (this.isLoggedIn) {
      const role = localStorage.getItem('role');

      let logoutObservable: Observable<IMessageResponse> | null = null;

      if (role === 'barber') {
        logoutObservable = this.authService.barberLogout();
      } else {
        localStorage.clear();
        this.authService.updateLoginState('barber', false, null, null);
        this.router.navigate([BARBER_ROUTES_PATHS.SIGNIN]);
        return;
      }

      logoutObservable.pipe(take(1)).subscribe({
        next: (res) => {
          this.authService.updateLoginState('barber', false, null, null);

          Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: res.message || 'You have been logged out successfully',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate([BARBER_ROUTES_PATHS.SIGNIN]);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: err?.message || 'Something went wrong.',
          });
        },
      });
    } else {
      this.router.navigate([BARBER_ROUTES_PATHS.SIGNIN]);
    }
  }
}
