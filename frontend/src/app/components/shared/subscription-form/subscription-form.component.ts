import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  CreateSubscriptionPlanDto,
  SubscriptionFeature,
} from '../../../interfaces/interfaces';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { REGEX } from '../../../constants/validators';

@Component({
  selector: 'app-subscription-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.css',
})
export class SubscriptionFormComponent {
  @Input() planData: CreateSubscriptionPlanDto | null = null;
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<CreateSubscriptionPlanDto>();

  planForm: FormGroup;
  private fb = inject(FormBuilder);

  availableFeatures = Object.values(SubscriptionFeature);
  private atLeastOneFeature(control: AbstractControl) {
  const value = control.value as any[];
  return value && value.length > 0 ? null : { required: true };
}


  constructor() {
    this.planForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX.LONG_NAME),
          Validators.maxLength(25),
        ],
      ],
      price: [null, [Validators.required, Validators.min(1)]],
      renewalPrice: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      durationUnit: ['', Validators.required],
      description: ['', Validators.required],
      features: this.fb.control<SubscriptionFeature[]>([], this.atLeastOneFeature),
    });
  }

  get featuresFormArray(): FormArray {
    return this.planForm.get('features') as FormArray;
  }

  onFeatureChange(event: Event, feature: SubscriptionFeature) {
  const checkbox = event.target as HTMLInputElement;
  const featuresControl = this.planForm.get('features');

  const currentFeatures = featuresControl?.value || [];

  if (checkbox.checked) {
    featuresControl?.setValue([...currentFeatures, feature]);
  } else {
    featuresControl?.setValue(currentFeatures.filter((f: SubscriptionFeature) => f !== feature));
  }

  featuresControl?.updateValueAndValidity();
}


  ngOnChanges(): void {
    if (this.planData) {
      this.planForm.patchValue(this.planData);
    } else {
      this.planForm.reset();
    }
  }

  submitForm(): void {
    console.log('submitted');

    this.planForm.markAllAsTouched();

    if (this.planForm.valid) {
      console.log('valid');

      this.onSubmit.emit(this.planForm.value as CreateSubscriptionPlanDto);
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
