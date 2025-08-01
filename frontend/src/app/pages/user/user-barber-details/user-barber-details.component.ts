import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import {
  BarberDto,
  IBarber,
  SlotResponse,
} from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-barber-details',
  imports: [DatePipe, CommonModule],
  templateUrl: './user-barber-details.component.html',
  styleUrl: './user-barber-details.component.css',
})
export class UserBarberDetailsComponent implements OnInit {
  barber: BarberDto | null = null;
  slots: SlotResponse = {};
  dates: string[] = [];
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
      slots: this.userService.fetchSlotsByBarber(this.barberId),
    }).subscribe({
      next: ({ barbers, slots }) => {
        const found = barbers.data.find((b) => b.id === this.barberId);
        this.barber = found || null;

        this.slots = slots;
        this.dates = Object.keys(slots);
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
    this.userService.fetchSlotsByBarber(this.barberId).subscribe((res) => {
      this.slots = res;
      this.dates = Object.keys(res);
    });
  }

  get slotDates(): string[] {
    return Object.keys(this.slots || {});
  }

  bookSlot(slot: any, date: string): void {
    console.log('Booking slot:', { date, slot });
    // Implement booking logic here, e.g. navigate to payment page or call API
  }
}
