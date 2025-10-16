import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Profile } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() profile!: Profile;
  @Output() edit = new EventEmitter<void>();
  @Output() uploadOrUpdate = new EventEmitter<File>();
  @Output() deletePic = new EventEmitter<void>();

  modalMode: 'upload' | 'update' = 'upload';

  onEditClick() {
    this.edit.emit();
  }

  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  openUpload(mode: 'upload' | 'update') {
  this.modalMode = mode;

  // Add a small delay to let Angular render modal component
  setTimeout(() => {
    this.fileUploadComponent.open();
  });
}


  onUploadFile(file: File) {
    this.uploadOrUpdate.emit(file);
  }

  onDeleteClick() {
    this.deletePic.emit();
  }
}
