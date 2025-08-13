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
import { USER_ROUTES_PATHS } from '../constants/user-route.constant';
import { UserBookingConfirmationComponent } from '../pages/user/user-booking-confirmation/user-booking-confirmation.component';
import { UserReviewComponent } from '../pages/user/user-review/user-review.component';

export const USER_ROUTES: Routes = [
  {
    path: USER_ROUTES_PATHS.HOME,
    component: UserHomeComponent,
    canActivate: [userAuthGuard],
  },
  {
    path: USER_ROUTES_PATHS.AUTH_CALLBACK,
    component: AuthCallbackComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  {
    path: USER_ROUTES_PATHS.SIGNIN,
    component: UserSigninComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  {
    path: USER_ROUTES_PATHS.SIGNUP,
    component: UserSignupComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  { path: USER_ROUTES_PATHS.VERIFY_OTP, component: UserOtpComponent },
  {
    path: USER_ROUTES_PATHS.FORGOT_PASSWORD,
    component: UserForgotPasswordComponent,
    canActivate: [userAlreadyLoggedInGuard],
  },
  { path: USER_ROUTES_PATHS.RESET_PASSWORD, component: UserResetPasswordComponent },
  {
    path: USER_ROUTES_PATHS.BARBERS,
    component: UserBarberComponent,
    canActivate: [userAuthGuard],
  },
  {
    path: USER_ROUTES_PATHS.FAVORITES,
    component: UserFavoritesComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: USER_ROUTES_PATHS.BARBER_DETAILS,
    component: UserBarberDetailsComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: USER_ROUTES_PATHS.BOOKINGS,
    component: UserBookingComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: USER_ROUTES_PATHS.BOOKING_CONFIRMATION,
    component: UserBookingConfirmationComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: USER_ROUTES_PATHS.REVIEW,
    component: UserReviewComponent,
    canActivate: [userAuthGuard]
  }
];
