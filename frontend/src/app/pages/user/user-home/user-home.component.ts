import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { BarberDto } from '../../../interfaces/interfaces';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { AuthService } from '../../../services/auth/auth.service';
import { pipe, first, forkJoin, firstValueFrom, take } from 'rxjs';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-user-home',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    CommonModule,
    BarberCardComponent,
    RouterModule,
  ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent implements OnInit {
  latestBarbers: BarberDto[] = [];

  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private favoritesService: FavoritesService = inject(FavoritesService);
  private authService: AuthService = inject(AuthService);

  fetchBarbers() {
    this.userService
      .fetchBarbers('', 1, 3)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.latestBarbers = res.data;
        },
        error: (err) => {
          console.error('Error fetching barbers:', err);
        },
      });
  }
  favoriteIds: string[] = [];

  ngOnInit() {
    this.loadBarbersAndFavorites();
  }

  fetchFavorites() {
    this.authService.userId$.pipe(take(1)).subscribe((userId) => {
      if (!userId) return;

      this.favoritesService
        .getFavoriteBarbers(userId, 1, 100)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.favoriteIds = res.data.map((barber) => barber.id);
            console.log('Favorite IDs:', this.favoriteIds);
          },
          error: (err) => {
            console.error('Error fetching favorites:', err);
          },
        });
    });
  }

  toggleFavorite(barberId: string) {
    this.authService.userId$.pipe(take(1)).subscribe((userId) => {
      if (!userId) return;

      this.favoritesService
        .updateFavorite(userId, barberId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.loadBarbersAndFavorites();
          },
          error: (err) => {
            console.error('Error updating favorite:', err);
          },
        });
    });
  }

  redirectToBarbers() {
    this.router.navigate([USER_ROUTES_PATHS.BARBERS]);
  }

  loadBarbersAndFavorites(): void {
    this.authService.userId$.pipe(take(1)).subscribe((userId) => {
      if (!userId) return;

      forkJoin({
        barbers: this.userService.fetchBarbers('', 1, 3),
        favorites: this.favoritesService.getFavoriteBarbers(userId, 1, 100),
      })
        .pipe(take(1))
        .subscribe({
          next: ({ barbers, favorites }) => {
            this.latestBarbers = barbers.data;
            this.favoriteIds = favorites.data.map((barber) => barber.id);
          },
          error: (err) => {
            console.error('Error loading barbers and favorites:', err);
          },
        });
    });
  }
}
