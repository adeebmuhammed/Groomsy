import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements AfterViewInit,OnDestroy{
  @Input() modalMode: 'upload' | 'update' = 'upload';
  @Output() fileSelected = new EventEmitter<File>();
  @Output() close = new EventEmitter<void>();

  selectedFile?: File;
  modalRef: any;

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('uploadModal');
    if (modalElement) {
      this.modalRef = new bootstrap.Modal(modalElement, { backdrop: 'static' });
    }
  }

  open() {
    this.selectedFile = undefined;
    this.modalRef?.show();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmitUpload() {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
      this.modalRef?.hide();
    }
  }

  onClose() {
    this.modalRef?.hide();
    this.close.emit();
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
  }
}
