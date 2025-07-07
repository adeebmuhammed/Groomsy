import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barber-header',
  imports: [ CommonModule ],
  templateUrl: './barber-header.component.html',
  styleUrl: './barber-header.component.css'
})
export class BarberHeaderComponent {
  isLoggedIn = false;
  barberName: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user-specific login state and name
    this.authService.isBarberLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.barberName$.subscribe(name => {
      this.barberName = name;
    });
  }

  handleAuth(): void {
  if (this.isLoggedIn) {
    const role = localStorage.getItem('role');

    let logoutObservable: Observable<any> | null = null;

    if (role === 'barber') {
      logoutObservable = this.authService.userLogout();
    } else {
      // Not user or unexpected role — fallback
      localStorage.clear();
      this.authService.updateLoginState('barber', false, null, null);
      this.router.navigate(['/barber/signin']);
      return;
    }

    logoutObservable.subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: res.message || 'You have been logged out successfully',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(['/barber/signin']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: err?.message || 'Something went wrong.',
        });
      }
    });
  } else {
    this.router.navigate(['/barber/signin']);
  }
}
}
