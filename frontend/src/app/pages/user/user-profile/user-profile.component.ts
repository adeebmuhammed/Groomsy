import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { EditProfile, UserProfileDto } from '../../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ProfileComponent } from '../../../components/shared/profile/profile.component';
import { EditProfileComponent } from '../../../components/shared/edit-profile/edit-profile.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { FileUploadComponent } from '../../../components/shared/file-upload/file-upload.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ProfileComponent,
    EditProfileComponent,
    CommonModule,
    FileUploadComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfile!: UserProfileDto;

  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);

  showEditModal = false;

  ngOnInit(): void {
    this.fetchProfile();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  fetchProfile() {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          return;
        }

        this.userService
          .fetchUserProfile(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.userProfile = res;
            },
            error: (err) => {
              console.error(err);
            },
          });
      });
  }

  onEditProfile() {
    this.showEditModal = true;
  }

  updateProfile(updated: EditProfile) {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          return;
        }

        this.userService
          .updateUserProfile(id, updated)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              this.showEditModal = false;
              Swal.fire(
                'Updated!',
                'Your Profile has been Updated Successfully.',
                'success'
              );
            },
            error: (err) => {
              console.error(err);
              Swal.fire(
                'Failed!',
                err.error?.error || 'Profile Updation Failed',
                'error'
              );
            },
          });
      });
  }

  isUploading = false;
  updateProfilePicture(file: File) {
    this.isUploading = true;
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          this.isUploading = false;
          return;
        }

        this.userService
          .updateProfilePicture(id, file)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              Swal.fire(
                'Success',
                res.message || 'Profile Picture Updated Successfully',
                'success'
              );
              this.isUploading = false;
              this.fetchProfile();
              this.closeUploadModal();
            },
            error: (err) => {
              console.error(err);
              Swal.fire(
                'Error',
                err.error.message || 'Profile Picture Updation Failed',
                'error'
              );
              this.isUploading = false;
            },
          });
      });
  }

  deleteProfilePicture() {
    this.authService.userId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) return;

        this.userService
          .deleteProfilePicture(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.userProfile.profilePicUrl = null;
              this.userProfile.profilePicKey = null;
              Swal.fire(
                'Success',
                res.message || 'Profile Picture Deleted Successfully',
                'success'
              );
            },
            error: (err) => {
              console.error(err);
              Swal.fire(
                'Error',
                err.error.message || 'Profile Picture Deletion Failed',
                'error'
              );
            },
          });
      });
  }

  modalMode: 'upload' | 'update' = 'upload';
  selectedFile?: File;

  openUpload(mode: 'upload' | 'update') {
    console.log('clicked');

    this.modalMode = mode;
    this.selectedFile = undefined;
    const modalEl = document.getElementById('fileUploadModal')!;
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });
      modal.show();
    }
  }

  closeUploadModal() {
    const modalEl = document.getElementById('fileUploadModal')!;
    bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0];
  }

  submitUpload() {
    if (!this.selectedFile) return;
    this.updateProfilePicture(this.selectedFile);
  }
}
