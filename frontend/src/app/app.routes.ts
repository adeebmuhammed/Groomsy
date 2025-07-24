import { Routes } from '@angular/router';
import { USER_ROUTES } from './routes/user.routes';
import { BARBER_ROUTES } from './routes/barber.routes';
import { ADMIN_ROUTES } from './routes/admin.routes';

export const routes: Routes = [
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  ...BARBER_ROUTES,
];
