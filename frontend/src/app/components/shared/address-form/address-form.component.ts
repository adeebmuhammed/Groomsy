import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BarberProfileDto } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { REGEX } from '../../../constants/validators';

@Component({
  selector: 'app-address-form',
  imports: [ ReactiveFormsModule,CommonModule ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {
  @Input() address?: {
    street?: string;
    city?: string;
    pincode?: string;
    district?: string;
  };
  @Output() save = new EventEmitter<BarberProfileDto['address']>();
  @Output() close = new EventEmitter<void>();

  addressForm!: FormGroup;

  districts: string[] = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      district: [this.address?.district || '', Validators.required],
      city: [this.address?.city || '', [Validators.required, Validators.pattern(REGEX.LONG_NAME)]],
      street: [this.address?.street || '', [Validators.required, Validators.pattern(REGEX.LONG_NAME)]],
      pincode: [
        this.address?.pincode || '',
        [Validators.required, Validators.pattern(/^\d{6}$/)]
      ]
    });
  }

  onSave() {
    if (this.addressForm.valid) {
      this.save.emit(this.addressForm.value);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  onClose() {
    this.close.emit();
  }
}
