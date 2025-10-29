import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Profile } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() profile!: Profile;
  @Output() edit = new EventEmitter<void>();
  @Output() uploadRequested = new EventEmitter<'upload' | 'update'>();
  @Output() deletePic = new EventEmitter<void>();
}
