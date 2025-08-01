import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarberDto } from '../../../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barber-card',
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.css']
})
export class BarberCardComponent {
  @Input() barber!: BarberDto;
  @Input() isFavorite: boolean = false;

  @Output() favoriteToggle = new EventEmitter<void>();

  constructor(private router: Router){}

  getBarberDetails(){
    this.router.navigate(['/user/barber-details',this.barber.id])
  }
}
