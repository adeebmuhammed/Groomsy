import { Routes } from "@angular/router";
import { AdminSigninComponent } from "../pages/admin/admin-signin/admin-signin.component";
import { adminAlreadyLoggedInGuard } from "../guards/admin/admin-already-logged-in/admin-already-logged-in.guard";
import { AdminDashboardComponent } from "../pages/admin/admin-dashboard/admin-dashboard.component";
import { adminAuthGuard } from "../guards/admin/admin-auth/admin-auth.guard";
import { AdminUsersListComponent } from "../pages/admin/admin-users-list/admin-users-list.component";
import { AdminBarbersListComponent } from "../pages/admin/admin-barbers-list/admin-barbers-list.component";
import { AdminCouponsComponent } from "../pages/admin/admin-coupons/admin-coupons.component";
import { AdminBookingComponent } from "../pages/admin/admin-booking/admin-booking.component";
import { AdminOfferComponent } from "../pages/admin/admin-offer/admin-offer.component";

export const ADMIN_ROUTES: Routes = [
  { path: 'admin/signin', component: AdminSigninComponent, canActivate: [adminAlreadyLoggedInGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/users', component: AdminUsersListComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/barbers', component: AdminBarbersListComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/coupons', component: AdminCouponsComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/bookings', component: AdminBookingComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/offers', component: AdminOfferComponent, canActivate: [adminAuthGuard] },
];
