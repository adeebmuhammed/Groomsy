import { Routes } from "@angular/router";
import { BarberDashboardComponent } from "../pages/barber/barber-dashboard/barber-dashboard.component";
import { barberAuthGuard } from "../guards/barber/barber-auth.guard";
import { barberAlreadyLoggedInGuard } from "../guards/barber/barber-already-logged-in/barber-already-logged-in.guard";
import { BarberSignupComponent } from "../pages/barber/barber-signup/barber-signup.component";
import { BarberSigninComponent } from "../pages/barber/barber-signin/barber-signin.component";
import { BarberOtpComponent } from "../pages/barber/barber-otp/barber-otp.component";
import { BarberForgotPasswordComponent } from "../pages/barber/barber-forgot-password/barber-forgot-password.component";
import { BarberResetPasswordComponent } from "../pages/barber/barber-reset-password/barber-reset-password.component";
import { BarberSlotsComponent } from "../pages/barber/barber-slots/barber-slots.component";
import { BarberBookingComponent } from "../pages/barber/barber-booking/barber-booking.component";
import { BARBER_ROUTES_PATHS } from "../constants/barber-route.constant";
import { BarberUnavailabilityComponent } from "../pages/barber/barber-unavailability/barber-unavailability.component";
import { BarberSubscriptionComponent } from "../pages/barber/barber-subscription/barber-subscription.component";

export const BARBER_ROUTES: Routes = [
  { path: BARBER_ROUTES_PATHS.DASHBOARD, component: BarberDashboardComponent, canActivate: [barberAuthGuard] },
  { path: BARBER_ROUTES_PATHS.SIGNUP, component: BarberSignupComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: BARBER_ROUTES_PATHS.SIGNIN, component: BarberSigninComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: BARBER_ROUTES_PATHS.VERIFY_OTP, component: BarberOtpComponent },
  { path: BARBER_ROUTES_PATHS.FORGOT_PASSWORD, component: BarberForgotPasswordComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: BARBER_ROUTES_PATHS.RESET_PASSWORD, component: BarberResetPasswordComponent },

  { path: BARBER_ROUTES_PATHS.SLOTS, component: BarberSlotsComponent, canActivate: [barberAuthGuard]},
  { path: BARBER_ROUTES_PATHS.BOOKINGS, component: BarberBookingComponent, canActivate: [barberAuthGuard]},
  { path: BARBER_ROUTES_PATHS.UNAVAILABILITY, component: BarberUnavailabilityComponent, canActivate: [barberAuthGuard]},
  { path: BARBER_ROUTES_PATHS.SUBSCRIPTION, component: BarberSubscriptionComponent, canActivate: [barberAuthGuard]},
];
