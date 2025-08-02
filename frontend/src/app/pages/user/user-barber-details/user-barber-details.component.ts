import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import {
  BarberDto,
  IBarber,
  SlotDto,
  SlotResponse,
} from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';

@Component({
  selector: 'app-user-barber-details',
  imports: [DatePipe, CommonModule, UserHeaderComponent,UserFooterComponent],
  templateUrl: './user-barber-details.component.html',
  styleUrl: './user-barber-details.component.css',
})
export class UserBarberDetailsComponent implements OnInit {
  barber: BarberDto | null = null;
  slots: SlotDto[] = [];
  barberId: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.barberId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    forkJoin({
      barbers: this.userService.fetchBarbers(),
      slots: this.userService.fetchSlotRulesByBarber(this.barberId),
    }).subscribe({
      next: ({ barbers, slots }) => {
        const found = barbers.data.find((b) => b.id === this.barberId);
        this.barber = found || null;

        this.slots = slots.data;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  fetchBarberDetails() {
    this.userService.fetchBarbers().subscribe((res) => {
      const found = res.data.find((b) => b.id === this.barberId);
      this.barber = found || null;
    });
  }

  fetchSlots() {
    this.userService.fetchSlotRulesByBarber(this.barberId).subscribe((res) => {
      this.slots = res.data;
    });
  }

  bookSlotFromOutside(): void {
  console.log('Navigating to booking...');
  // Navigate to booking page or open a modal — your logic here
}

}
