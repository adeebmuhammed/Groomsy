import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @Input() modalMode: 'upload' | 'update' = 'upload';
  @Output() fileSelected = new EventEmitter<File>();

  selectedFile?: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target?.files?.[0];
  }

  submit() {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
      this.selectedFile = undefined;
    }
  }
}