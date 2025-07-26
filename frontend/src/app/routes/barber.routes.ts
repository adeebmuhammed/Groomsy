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

export const BARBER_ROUTES: Routes = [
  { path: 'barber/dashboard', component: BarberDashboardComponent, canActivate: [barberAuthGuard] },
  { path: 'barber/signup', component: BarberSignupComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: 'barber/signin', component: BarberSigninComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: 'barber/verify-otp', component: BarberOtpComponent },
  { path: 'barber/forgot-password', component: BarberForgotPasswordComponent, canActivate: [barberAlreadyLoggedInGuard] },
  { path: 'barber/reset-password', component: BarberResetPasswordComponent },

  { path: 'barber/slots', component: BarberSlotsComponent, canActivate: [barberAuthGuard]}
];
