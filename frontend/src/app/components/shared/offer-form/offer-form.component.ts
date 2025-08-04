import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-offer-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './offer-form.component.html',
  styleUrl: './offer-form.component.css',
})
export class OfferFormComponent {
  @Input() offerData: any = null; // For edit
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  offerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.offerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern(/\S+/)]],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        discount: [
          '',
          [
            Validators.required,
            Validators.min(1),
            Validators.max(100),
            Validators.pattern(/^\d+$/),
          ],
        ],
      },
      { validators: this.dateRangeValidator }
    );
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    return start && end && start <= end ? null : { dateRangeInvalid: true };
  }

  ngOnChanges() {
    if (this.offerData) {
      const formatDate = (dateStr: string | Date) =>
        new Date(dateStr).toISOString().split('T')[0];

      this.offerForm.patchValue({
        name: this.offerData.name,
        startDate: formatDate(this.offerData.startDate),
        endDate: formatDate(this.offerData.endDate),
        discount: this.offerData.discount,
      });
    } else {
      this.offerForm.reset();
    }
  }

  submitOfferForm() {
    if (this.offerForm.valid) {
      const value = this.offerForm.value;

      const payload = {
        ...value,
        startDate: new Date(value.startDate),
        endDate: new Date(value.endDate),
      };

      this.onSubmit.emit(payload);
    }
  }

  close() {
    this.onClose.emit();
  }
}
