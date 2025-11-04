import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ROLES } from '../../../constants/roles';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';
import { BARBER_ROUTES_PATHS } from '../../../constants/barber-route.constant';
import { ADMIN_ROUTES_PATHS } from '../../../constants/admin-route.constant';

@Component({
  selector: 'app-landing',
  imports: [ RouterLink ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit{
  currentYear = new Date().getFullYear();

  private router = inject(Router)

  ngOnInit(): void {
    const role = localStorage.getItem('role')

    if (role && role === ROLES.USER) {
      this.router.navigate([USER_ROUTES_PATHS.SIGNIN])
    }else if (role && role === ROLES.BARBER) {
      this.router.navigate([BARBER_ROUTES_PATHS.SIGNIN])
    }else if (role && role === ROLES.ADMIN) {
      this.router.navigate([ADMIN_ROUTES_PATHS.SIGNIN])
    }else {
      this.router.navigate(["/"])
    }
  }
}
