import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BarberDto } from '../../../interfaces/interfaces';
import { Router } from '@angular/router';
import { USER_ROUTES_PATHS } from '../../../constants/user-route.constant';

@Component({
  selector: 'app-barber-card',
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.css'],
})
export class BarberCardComponent {
  @Input() barber!: BarberDto;
  @Input() isFavorite = false;

  @Output() favoriteToggle = new EventEmitter<void>();

  private router: Router = inject(Router);

  getBarberDetails() {
    this.router.navigate([`${USER_ROUTES_PATHS.BARBER_DETAILS}`, this.barber.id]);
  }
}
