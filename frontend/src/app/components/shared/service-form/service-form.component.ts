import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  imports: [ CommonModule,ReactiveFormsModule ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export class ServiceFormComponent {
  @Input() serviceData: any = null; 
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  serviceForm: FormGroup;
  durationOptions = ["15m", "30m", "45m", "60m", "75m", "90m", "105m", "120m"];

  private fb = inject(FormBuilder);

  constructor() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      description: ['', [Validators.required, Validators.pattern(/\S+/)]],
      duration: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnChanges() {
    if (this.serviceData) {
      this.serviceForm.patchValue({
        name: this.serviceData.name,
        description: this.serviceData.description,
        duration: this.serviceData.duration,
        price: this.serviceData.price
      });
    } else {
      this.serviceForm.reset();
    }
  }

  submitServiceForm() {
    if (this.serviceForm.valid) {
      this.onSubmit.emit(this.serviceForm.value);
    }
  }

  close() {
    this.onClose.emit();
  }
}
