import { Component } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  imports: [ UserHeaderComponent,UserFooterComponent,CommonModule ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent{
  constructor() {}
  latestBarbers = [
  {
    name: 'Dan Gregory',
    role: 'Barber',
    price: 99,
    availableDay: 'Monday',
    location: 'Calicut',
    slots: 'Slots Available',
    image: 'assets/images/dan.jpg'
  },
  {
    name: 'Sam Rascals',
    role: 'Barber',
    price: 99,
    availableDay: 'Monday',
    location: 'Calicut',
    slots: 'Limited Slot',
    image: 'assets/images/sam.jpg'
  },
  {
    name: 'Kochi Faraj',
    role: 'Stylist',
    price: 149,
    availableDay: 'Monday',
    location: 'Calicut',
    slots: 'Limited Slots',
    image: 'assets/images/kochi.jpg'
  }
];

}