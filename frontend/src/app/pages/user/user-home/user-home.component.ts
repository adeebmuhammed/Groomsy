import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { BarberDto } from '../../../interfaces/interfaces';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { AuthService } from '../../../services/auth/auth.service';

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

  constructor(
    private router: Router,
    private userService: UserService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  fetchBarbers() {
    this.userService.fetchBarbers('', 1, 3).subscribe({
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
    this.fetchBarbers();
    this.fetchFavorites();
  }

  fetchFavorites() {
    let userId = '';
    this.authService.userId$.subscribe((id) => {
      if (id) userId = id;
    });

    this.favoritesService.getFavoriteBarbers(userId, 1, 100).subscribe({
      next: (res) => {
        this.favoriteIds = res.data.map((barber) => barber.id);
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
        this.fetchBarbers();
        this.fetchFavorites();
      },
      error: (err) => {
        console.error('Error updating favorite:', err);
      },
    });
  }

  redirectToBarbers() {
    this.router.navigate(['user/barbers']);
  }
}
