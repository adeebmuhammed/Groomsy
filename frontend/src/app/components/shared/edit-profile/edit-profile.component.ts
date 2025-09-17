import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EditProfile,
  Profile,
  UserProfileDto,
} from '../../../interfaces/interfaces';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { REGEX } from '../../../constants/validators';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent {
  @Input() profile!: Profile;
  @Output() save = new EventEmitter<EditProfile>();
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [
        this.profile?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(REGEX.LONG_NAME),
        ],
      ],
      email: [
        this.profile?.email || '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(REGEX.EMAIL),
        ],
      ],
      phone: [
        this.profile?.phone || '',
        [Validators.required, Validators.pattern(REGEX.PHONE)],
      ],
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value as EditProfile);
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
