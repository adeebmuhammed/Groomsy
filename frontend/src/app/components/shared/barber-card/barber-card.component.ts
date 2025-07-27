import { Component, Input } from '@angular/core';
import { BarberDto } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-barber-card',
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.css']
})
export class BarberCardComponent {
  @Input() barber!: BarberDto;
}
