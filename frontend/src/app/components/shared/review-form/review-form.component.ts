import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewCreateRequestDto } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  imports: [ ReactiveFormsModule,CommonModule ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent {
  @Input() visible = false; // Controls modal visibility
  @Output() submitReview = new EventEmitter<ReviewCreateRequestDto>();
  @Output() closeForm = new EventEmitter<void>();

  reviewForm: FormGroup;
  stars = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      reviewText: ['', [Validators.required, Validators.minLength(5)]],
      rating: [0, Validators.required]
    });
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  submitForm() {
    if (this.reviewForm.valid) {
      this.submitReview.emit(this.reviewForm.value);
      this.reviewForm.reset({ rating: 0, reviewText: '' });
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }

  close() {
    this.closeForm.emit();
  }
}
