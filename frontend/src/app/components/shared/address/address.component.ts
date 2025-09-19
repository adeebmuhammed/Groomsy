import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarberProfileDto } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  imports: [ CommonModule ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  @Input() address?: {
    street?: string;
    city?: string;
    pincode?: string;
    district?: string;
  };

  @Output() editAddress = new EventEmitter<void>();

  onEdit() {
    this.editAddress.emit();
  }
}
