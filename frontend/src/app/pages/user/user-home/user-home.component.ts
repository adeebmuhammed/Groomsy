import { Component } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { BarberDto } from '../../../interfaces/interfaces';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-home',
  imports: [ UserHeaderComponent,UserFooterComponent,CommonModule,BarberCardComponent,RouterModule ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent{
  latestBarbers: BarberDto[] = [];

  constructor(private router: Router,private userService: UserService) {}

  ngOnInit() {
    this.fetchBarbers();
  }

  fetchBarbers() {
    this.userService.fetchBarbers('', 1, 3).subscribe({
      next: (res) => {
        this.latestBarbers = res.data;
      },
      error: (err) => {
        console.error('Error fetching barbers:', err);
      }
    });
  }

  redirectToBarbers(){
    this.router.navigate(['user/barbers']);
  }
}