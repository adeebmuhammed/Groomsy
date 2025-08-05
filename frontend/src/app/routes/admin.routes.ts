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
import { ADMIN_ROUTES_PATHS } from "../constants/admin-route.constant";

export const ADMIN_ROUTES: Routes = [
  { path: ADMIN_ROUTES_PATHS.SIGNIN, component: AdminSigninComponent, canActivate: [adminAlreadyLoggedInGuard] },
  { path: ADMIN_ROUTES_PATHS.DASHBOARD, component: AdminDashboardComponent, canActivate: [adminAuthGuard] },
  { path: ADMIN_ROUTES_PATHS.USERS, component: AdminUsersListComponent, canActivate: [adminAuthGuard] },
  { path: ADMIN_ROUTES_PATHS.BARBERS, component: AdminBarbersListComponent, canActivate: [adminAuthGuard] },
  { path: ADMIN_ROUTES_PATHS.COUPONS, component: AdminCouponsComponent, canActivate: [adminAuthGuard] },
  { path: ADMIN_ROUTES_PATHS.BOOKINGS, component: AdminBookingComponent, canActivate: [adminAuthGuard] },
  { path: ADMIN_ROUTES_PATHS.OFFERS, component: AdminOfferComponent, canActivate: [adminAuthGuard] },
];
