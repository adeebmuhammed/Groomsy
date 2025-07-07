import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-header',
  imports: [ CommonModule ],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})

export class UserHeaderComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user-specific login state and name
    this.authService.isUserLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  handleAuth(): void {
  if (this.isLoggedIn) {
    const role = localStorage.getItem('role');

    let logoutObservable: Observable<any> | null = null;

    if (role === 'user') {
      logoutObservable = this.authService.userLogout();
    } else {
      // Not user or unexpected role — fallback
      localStorage.clear();
      this.authService.updateLoginState('user', false, null, null);
      this.router.navigate(['/signin']);
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

        this.router.navigate(['/user/signin']);
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
    this.router.navigate(['/signin']);
  }
}
}
