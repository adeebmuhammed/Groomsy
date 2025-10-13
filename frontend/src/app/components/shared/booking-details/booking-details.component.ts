import { Component, Input } from '@angular/core';
import { BookingResponseDto, Service } from '../../../interfaces/interfaces';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  imports: [ DatePipe,TitleCasePipe,CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {
  @Input() booking: BookingResponseDto | null = null;
  @Input() service: Service | null = null;
  @Input() user: string | null = null;
  @Input() barber: string | null = null;

  formatTimeUTC(dateStr: Date): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  }
}
