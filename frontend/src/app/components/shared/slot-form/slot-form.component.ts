import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DaySlot, SlotDto } from '../../../interfaces/interfaces';
@Component({
  selector: 'app-slot-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './slot-form.component.html',
  styleUrl: './slot-form.component.css',
})
export class SlotFormComponent implements OnChanges {
  @Input() slotData: SlotDto | null = null;
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter();

  weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  slotForm: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.slotForm = this.fb.group({});

    for (const day of this.weekDays) {
      this.slotForm.addControl(day, new FormControl(false));

      this.slotForm.addControl(
        `${day}_startTime`,
        new FormControl({ value: '', disabled: true }, Validators.required)
      );
      this.slotForm.addControl(
        `${day}_endTime`,
        new FormControl({ value: '', disabled: true }, Validators.required)
      );

      this.slotForm.get(day)?.valueChanges.subscribe((checked) => {
        const startCtrl = this.slotForm.get(`${day}_startTime`);
        const endCtrl = this.slotForm.get(`${day}_endTime`);
        if (checked) {
          startCtrl?.enable();
          endCtrl?.enable();
        } else {
          startCtrl?.disable();
          endCtrl?.disable();
        }
      });
    }
  }

  ngOnChanges() {
    if (this.slotData) {
      this.slotForm.reset();
      this.slotData.slots.forEach((slot: any) => {
        this.slotForm.patchValue({
          [slot.day]: true,
          [`${slot.day}_startTime`]: slot.startTime, // Already in HH:mm
          [`${slot.day}_endTime`]: slot.endTime,
        });
      });
    } else {
      this.slotForm.reset();
    }
  }

  getDayControl(day: string, field: 'startTime' | 'endTime'): FormControl {
    return this.slotForm.get(`${day}_${field}`) as FormControl;
  }

  submitForm() {
    this.slotForm.markAllAsTouched();

    if (this.slotForm.valid) {
      const formValues = this.slotForm.value;

      const slots: DaySlot[] = this.weekDays
        .filter((day) => formValues[day])
        .map((day) => {
          return {
            day,
            startTime: formValues[`${day}_startTime`], // string HH:mm
            endTime: formValues[`${day}_endTime`], // string HH:mm
          };
        });

      const finalPayload = { slots };
      this.onSubmit.emit(finalPayload);
    }
  }

  close() {
    this.onClose.emit();
  }
}
