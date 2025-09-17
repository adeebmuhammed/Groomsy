import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Profile } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() profile!: Profile;
  @Output() edit = new EventEmitter<void>();

  onEditClick() {
    this.edit.emit();
  }
}
