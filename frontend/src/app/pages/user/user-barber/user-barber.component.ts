import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { BarberDto } from '../../../interfaces/interfaces';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { Subject, takeUntil } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-barber',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    BarberCardComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-barber.component.html',
  styleUrl: './user-barber.component.css',
})
export class UserBarberComponent implements OnInit, OnDestroy {
  barbers: BarberDto[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 4;
  selectedDistrict = '';
  districts: string[] = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod',
  ];

  private userService: UserService = inject(UserService);
  private authService: AuthService = inject(AuthService);
  private favoritesService: FavoritesService = inject(FavoritesService);

  ngOnInit(): void {
    this.loadBarbersAndFavorites();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  favoriteIds: string[] = [];

  toggleFavorite(barberId: string) {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((userId) => {
        if (!userId) return;

        this.favoritesService
          .updateFavorite(userId, barberId)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              this.loadBarbersAndFavorites();
            },
            error: (err) => {
              console.error('Error updating favorite:', err);
            },
          });
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBarbersAndFavorites();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBarbersAndFavorites();
    }
  }

  loadBarbersAndFavorites(): void {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((userId) => {
        if (!userId) return;

        forkJoin({
          barbers: this.userService.fetchBarbers(
            this.searchTerm,
            this.currentPage,
            this.pageSize,
            this.selectedDistrict
          ),
          favorites: this.favoritesService.getFavoriteBarbers(userId, 1, 100),
        })
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: ({ barbers, favorites }) => {
              this.barbers = barbers.data;
              this.totalPages = barbers.pagination.totalPages;
              this.favoriteIds = favorites.data.map((barber) => barber.id);
            },
            error: (err) => {
              console.error('Error loading barbers and favorites:', err);
            },
          });
      });
  }
}
