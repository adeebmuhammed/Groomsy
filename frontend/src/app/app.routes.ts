import { Routes } from '@angular/router';
import { USER_ROUTES } from './routes/user.routes';
import { BARBER_ROUTES } from './routes/barber.routes';
import { ADMIN_ROUTES } from './routes/admin.routes';
import { LandingComponent } from './pages/general/landing/landing.component';

export const routes: Routes = [
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  ...BARBER_ROUTES,
  {
      path: "",
      component: LandingComponent
    }
];
