import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  imports: [ CommonModule ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent implements OnInit{
  isLoggedIn = false;
  adminName: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAdminLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.adminName$.subscribe(name => {
      this.adminName = name;
    });
  }

  handleAdminAuth(): void {
    if (this.isLoggedIn) {
      this.authService.adminLogout().subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been logged out.',
            timer: 1500,
            showConfirmButton: false,
          });
          this.router.navigate(['/admin/signin']);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: 'Try again later.',
          });
        }
      });
    } else {
      this.router.navigate(['/admin/signin']);
    }
  }
}
