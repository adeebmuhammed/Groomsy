import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarberDto, BookingResponseDto, Service } from '../../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-modal',
  imports: [ FormsModule,CommonModule ],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.css'
})
export class CheckoutModalComponent {
  @Input() barber: BarberDto | null | undefined = null;
  @Input() service: Service | null | undefined = null;
  @Input() booking: BookingResponseDto | null = null; // ✅ pass full booking
  @Input() startTime: Date | null = null;
  @Input() endTime: Date | null = null;

  @Output() onCouponApplication = new EventEmitter<string>();
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  couponCode: string = '';

  confirmBooking() {
    this.onConfirm.emit();
  }

  cancelBooking() {
    this.onCancel.emit();
  }

  couponApplication() {
    this.onCouponApplication.emit(this.couponCode.trim());
  }
}
