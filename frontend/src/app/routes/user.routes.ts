import { Routes } from '@angular/router';
import { UserHomeComponent } from '../pages/user/user-home/user-home.component';
import { userAuthGuard } from '../guards/user/user-auth/user-auth.guard';
import { AuthCallbackComponent } from '../components/user/auth-callback/auth-callback.component';
import { userAlreadyLoggedInGuard } from '../guards/user/user-already-logged-in/user-already-logged-in.guard';
import { UserSigninComponent } from '../pages/user/user-signin/user-signin.component';
import { UserSignupComponent } from '../pages/user/user-signup/user-signup.component';
import { UserOtpComponent } from '../pages/user/user-otp/user-otp.component';
import { UserForgotPasswordComponent } from '../pages/user/user-forgot-password/user-forgot-password.component';
import { UserResetPasswordComponent } from '../pages/user/user-reset-password/user-reset-password.component';
import { UserBarberComponent } from '../pages/user/user-barber/user-barber.component';
import { UserFavoritesComponent } from '../pages/user/user-favorites/user-favorites.component';
import { UserBarberDetailsComponent } from '../pages/user/user-barber-details/user-barber-details.component';
import { UserBookingComponent } from '../pages/user/user-booking/user-booking.component';

export const USER_ROUTES: Routes = [
  {
    path: 'user/home',
    component: UserHomeComponent,
    canActivate: [userAuthGuard],
  },
  {
    path: 'user/auth-callback',
    component: AuthCallbackComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  {
    path: 'user/signin',
    component: UserSigninComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  {
    path: 'user/signup',
    component: UserSignupComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  { path: 'user/verify-otp', component: UserOtpComponent },
  {
    path: 'user/forgot-password',
    component: UserForgotPasswordComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  { path: 'user/reset-password', component: UserResetPasswordComponent },
  {
    path: 'user/barbers',
    component: UserBarberComponent,
    canActivate: [userAuthGuard],
  },
  {
    path: 'user/favorites',
    component: UserFavoritesComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'user/barber-details/:id',
    component: UserBarberDetailsComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'user/bookings',
    component: UserBookingComponent,
    canActivate: [userAuthGuard]
  }
];
