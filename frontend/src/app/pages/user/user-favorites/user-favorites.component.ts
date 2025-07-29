import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { BarberDto, PaginatedResponse } from '../../../interfaces/interfaces';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-user-favorites',
  imports: [ UserHeaderComponent,UserFooterComponent,BarberCardComponent,CommonModule,FormsModule],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css'
})
export class UserFavoritesComponent implements OnInit {
  barbers: BarberDto[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 4;

  constructor(private userService: UserService, private authService: AuthService, private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.fetchFavorites()
  }

  fetchFavorites() {
    let userId = '';
    this.authService.userId$.subscribe((id) => {
      if (id) userId = id;
    });

    this.favoritesService.getFavoriteBarbers(userId, 1, 100).subscribe({
      next: (res) => {
        this.barbers = res.data;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
      },
    });
  }

  toggleFavorite(barberId: string) {
    let userId = '';
    this.authService.userId$.subscribe((id) => {
      if (id) userId = id;
    });
    this.favoritesService.updateFavorite(userId, barberId).subscribe({
      next: (res) => {
        console.log('Favorite updated:', res);
        this.fetchFavorites();
      },
      error: (err) => {
        console.error('Error updating favorite:', err);
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchFavorites()
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchFavorites()
    }
  }
}
