import { Routes } from '@angular/router';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { UserSigninComponent } from './pages/user/user-signin/user-signin.component';
import { UserOtpComponent } from './pages/user/user-otp/user-otp.component';
import { AdminSigninComponent } from './pages/admin/admin-signin/admin-signin.component';
import { UserSignupComponent } from './pages/user/user-signup/user-signup.component';
import { UserForgotPasswordComponent } from './pages/user/user-forgot-password/user-forgot-password.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserResetPasswordComponent } from './pages/user/user-reset-password/user-reset-password.component';
import { BarberSignupComponent } from './pages/barber/barber-signup/barber-signup.component';
import { BarberOtpComponent } from './pages/barber/barber-otp/barber-otp.component';
import { BarberDashboardComponent } from './pages/barber/barber-dashboard/barber-dashboard.component';
import { BarberSigninComponent } from './pages/barber/barber-signin/barber-signin.component';
import { BarberForgotPasswordComponent } from './pages/barber/barber-forgot-password/barber-forgot-password.component';
import { BarberResetPasswordComponent } from './pages/barber/barber-reset-password/barber-reset-password.component';
import { userAuthGuard } from './guards/user/user-auth/user-auth.guard';
import { AuthCallbackComponent } from './components/user/auth-callback/auth-callback.component';
import { barberAuthGuard } from './guards/barber/barber-auth/barber-auth.guard';
import { adminAuthGuard } from './guards/admin/admin-auth/admin-auth.guard';
import { adminAlreadyLoggedInGuard } from './guards/admin/admin-already-logged-in/admin-already-logged-in.guard';
import { userAlreadyLoggedInGuard } from './guards/user/user-already-logged-in/user-already-logged-in.guard';
import { barberAlreadyLoggedInGuard } from './guards/barber/barber-already-logged-in/barber-already-logged-in.guard';
import { AdminUsersListComponent } from './pages/admin/admin-users-list/admin-users-list.component';
import { AdminBarbersListComponent } from './pages/admin/admin-barbers-list/admin-barbers-list.component';

export const routes: Routes = [
  {
    path: 'user/home',
    component: UserHomeComponent,
    canActivate: [userAuthGuard]
  },
  {
  path: 'user/auth-callback',
  component: AuthCallbackComponent,
  canActivate:[userAlreadyLoggedInGuard]
},
  { path: 'user/signin', component: UserSigninComponent, canActivate:[userAlreadyLoggedInGuard] },
  { path: 'user/signup', component: UserSignupComponent, canActivate:[userAlreadyLoggedInGuard] },
  { path: 'user/verify-otp', component: UserOtpComponent },
  { path: 'user/forgot-password', component: UserForgotPasswordComponent, canActivate:[userAlreadyLoggedInGuard]},
  { path: 'user/reset-password', component: UserResetPasswordComponent},

  { path: 'admin/signin', component: AdminSigninComponent, canActivate:[adminAlreadyLoggedInGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate:[adminAuthGuard]},
  { path: 'admin/users', component: AdminUsersListComponent, canActivate:[adminAuthGuard]},
  { path: 'admin/barbers', component: AdminBarbersListComponent, canActivate:[adminAuthGuard]},

  { path: 'barber/dashboard', component: BarberDashboardComponent, canActivate:[barberAuthGuard] },
  { path: 'barber/signup', component: BarberSignupComponent, canActivate:[barberAlreadyLoggedInGuard] },
  { path: 'barber/signin', component: BarberSigninComponent, canActivate:[barberAlreadyLoggedInGuard] },
  { path: 'barber/verify-otp', component: BarberOtpComponent},
  { path: 'barber/forgot-password', component: BarberForgotPasswordComponent, canActivate:[barberAlreadyLoggedInGuard]},
  { path: 'barber/reset-password', component: BarberResetPasswordComponent}
];
