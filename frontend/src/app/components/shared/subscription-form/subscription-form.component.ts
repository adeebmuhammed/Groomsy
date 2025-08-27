import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CreateSubscriptionPlanDto } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { REGEX } from '../../../constants/validators';

@Component({
  selector: 'app-subscription-form',
  imports: [ CommonModule,ReactiveFormsModule ],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.css'
})
export class SubscriptionFormComponent {
  @Input() planData: CreateSubscriptionPlanDto | null = null;
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<CreateSubscriptionPlanDto>();

  planForm: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.planForm = this.fb.group({
      name: ['', Validators.required, Validators.pattern(REGEX.LONG_NAME)],
      price: [null, [Validators.required, Validators.min(1)]],
      renewalPrice: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      durationUnit: ['', Validators.required],
      description: ['']
    });
  }

  ngOnChanges(): void {
    if (this.planData) {
      this.planForm.patchValue(this.planData);
    } else {
      this.planForm.reset();
    }
  }

  submitForm(): void {
    this.planForm.markAllAsTouched();

    if (this.planForm.valid) {
      this.onSubmit.emit(this.planForm.value as CreateSubscriptionPlanDto);
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
