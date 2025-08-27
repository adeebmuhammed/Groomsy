import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { REGEX } from '../../../constants/validators';

@Component({
  selector: 'app-coupon-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './coupon-form.component.html',
  styleUrl: './coupon-form.component.css',
})
export class CouponFormComponent implements OnChanges {
  @Input() couponData: any = null; // For edit
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  couponForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.couponForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern(REGEX.LONG_NAME)]],
        code: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        maxCount: [
          '',
          [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
        ],
        limitAmount: [
          '',
          [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
        ],
        couponAmount: [
          '',
          [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
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
    if (this.couponData) {
      const formatDate = (dateStr: string | Date) =>
        new Date(dateStr).toISOString().split('T')[0];

      this.couponForm.patchValue({
        name: this.couponData.name,
        code: this.couponData.code,
        startDate: formatDate(this.couponData.startDate),
        endDate: formatDate(this.couponData.endDate),
        maxCount: this.couponData.maxCount,
        limitAmount: this.couponData.limitAmount,
        couponAmount: this.couponData.couponAmount,
      });
    } else {
      this.couponForm.reset();
    }
  }

  submitForm() {
    if (this.couponForm.valid) {
      const value = this.couponForm.value;

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
