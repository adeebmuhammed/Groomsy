import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { IMessageResponse } from '../../../interfaces/interfaces';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-header',
  imports: [CommonModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css',
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string | null = null;

  private clickListener: any;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private elementRef: ElementRef = inject(ElementRef);

  ngOnInit(): void {
    this.authService.isUserLoggedIn$
      .pipe(take(1))
      .subscribe((status) => (this.isLoggedIn = status));
    this.authService.userName$
      .pipe(take(1))
      .subscribe((name) => (this.userName = name));

    this.clickListener = (event: MouseEvent) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickListener);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  handleAuth(): void {
    if (this.isLoggedIn) {
      const role = localStorage.getItem('role');

      let logoutObservable: Observable<IMessageResponse> | null = null;

      if (role === 'user') {
        logoutObservable = this.authService.userLogout();
      } else {
        localStorage.clear();
        this.authService.updateLoginState('user', false, null, null);
        this.router.navigate([USER_ROUTES_PATHS.SIGNIN]);
        return;
      }

      logoutObservable.pipe(take(1)).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: res.message || 'You have been logged out successfully',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate([USER_ROUTES_PATHS.SIGNIN]);
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
      this.router.navigate([USER_ROUTES_PATHS.SIGNIN]);
    }
  }
  showDropdown = false;

  closeDropdown() {
    setTimeout(() => (this.showDropdown = false), 100);
  }

  navigateTo(section: string) {
    this.showDropdown = false;
    switch (section) {
      case 'profile':
        this.router.navigate([USER_ROUTES_PATHS.PROFILE]);
        break;
      case 'bookings':
        this.router.navigate([USER_ROUTES_PATHS.BOOKINGS]);
        break;
      case 'favorites':
        this.router.navigate([USER_ROUTES_PATHS.FAVORITES]);
        break;
      case 'reviews':
        this.router.navigate([USER_ROUTES_PATHS.REVIEW]);
        break;
    }
  }
}
