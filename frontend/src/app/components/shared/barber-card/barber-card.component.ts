import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarberDto } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-barber-card',
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.css']
})
export class BarberCardComponent {
  @Input() barber!: BarberDto;
  @Input() isFavorite: boolean = false;

  @Output() favoriteToggle = new EventEmitter<void>();
}
