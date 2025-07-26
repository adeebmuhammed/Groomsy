import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-slot-form',
  imports: [ ReactiveFormsModule,CommonModule ],
  templateUrl: './slot-form.component.html',
  styleUrl: './slot-form.component.css'
})
export class SlotFormComponent {
  @Input() slotData: any = null; // null for Add, existing data for Edit
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  slotForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.slotForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnChanges() {
  if (this.slotData) {
    const dateObj = new Date(this.slotData.date);
    const startObj = new Date(this.slotData.startTime);
    const endObj = new Date(this.slotData.endTime);

    const formattedDate = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const formattedStartTime = startObj.toISOString().slice(11, 16); // 'HH:mm'
    const formattedEndTime = endObj.toISOString().slice(11, 16); // 'HH:mm'

    this.slotForm.patchValue({
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      price: this.slotData.price
    });
  } else {
    this.slotForm.reset();
  }
}


  submitForm() {
  if (this.slotForm.valid) {
    const { date, startTime, endTime, price } = this.slotForm.value;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const finalPayload = {
      date: new Date(date),
      startTime: startDateTime,
      endTime: endDateTime,
      price
    };

    this.onSubmit.emit(finalPayload);
  }
}

  close() {
    this.onClose.emit();
  }
}
