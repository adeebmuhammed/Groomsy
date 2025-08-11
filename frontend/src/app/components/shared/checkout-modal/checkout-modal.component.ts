import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarberDto, Service } from '../../../interfaces/interfaces';
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
  @Input() startTime: Date | null = null;
  @Input() endTime: Date | null = null;
  @Input() price: number = 0;

  @Output() onConfirm = new EventEmitter<string>(); // emits coupon code if applied
  @Output() onCancel = new EventEmitter<void>();

  couponCode: string = '';

  confirmBooking() {
    this.onConfirm.emit(this.couponCode.trim());
  }

  cancelBooking() {
    this.onCancel.emit();
  }
}
