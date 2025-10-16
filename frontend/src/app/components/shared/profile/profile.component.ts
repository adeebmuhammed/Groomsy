import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Profile } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() profile!: Profile;
  @Output() edit = new EventEmitter<void>();
  @Output() uploadOrUpdate = new EventEmitter<File>();
  @Output() deletePic = new EventEmitter<void>();

  selectedFile?: File;
  previewUrl: string | ArrayBuffer | null = null;
  modalMode: 'upload' | 'update' = 'upload';

  private modalRef: any;

  onEditClick() {
    this.edit.emit();
  }

  openUploadModal(mode: 'upload' | 'update') {
    this.modalMode = mode;
    this.selectedFile = undefined;
    this.previewUrl = null;

    const modalElement = document.getElementById('uploadModal');
    if (!modalElement) return;
    this.modalRef = new bootstrap.Modal(modalElement);
    this.modalRef.show();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmitUpload() {
    if (this.selectedFile) {
      this.uploadOrUpdate.emit(this.selectedFile);
      this.modalRef.hide();
    }
  }

  onDeleteClick() {
    this.deletePic.emit();
  }
}