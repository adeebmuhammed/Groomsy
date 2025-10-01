import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { ADMIN_ROUTES_PATHS } from '../../../constants/admin-route.constant';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent implements OnInit {
  isLoggedIn = false;
  adminName: string | null = '';

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.authService.isAdminLoggedIn$.pipe(take(1)).subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.adminName$.pipe(take(1)).subscribe((name) => {
      this.adminName = name;
    });
  }

  handleAdminAuth(): void {
    if (this.isLoggedIn) {
      this.authService
        .adminLogout()
        .pipe(take(1))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Logged Out',
              text: 'You have been logged out.',
              timer: 1500,
              showConfirmButton: false,
            });
            this.router.navigate([ADMIN_ROUTES_PATHS.SIGNIN]);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Logout Failed',
              text: 'Try again later.',
            });
          },
        });
    } else {
      this.router.navigate([ADMIN_ROUTES_PATHS.SIGNIN]);
    }
  }
}
