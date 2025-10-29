import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { ProfileComponent } from '../../../components/shared/profile/profile.component';
import { BarberProfileDto, EditProfile } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { BarberService } from '../../../services/barber/barber.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { EditProfileComponent } from '../../../components/shared/edit-profile/edit-profile.component';
import { CommonModule } from '@angular/common';
import { AddressComponent } from '../../../components/shared/address/address.component';
import { AddressFormComponent } from '../../../components/shared/address-form/address-form.component';
import { FileUploadComponent } from '../../../components/shared/file-upload/file-upload.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-barber-profile',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    ProfileComponent,
    EditProfileComponent,
    AddressComponent,
    AddressFormComponent,
    CommonModule,
    FileUploadComponent,
  ],
  templateUrl: './barber-profile.component.html',
  styleUrl: './barber-profile.component.css',
})
export class BarberProfileComponent implements OnInit, OnDestroy {
  barberProfile!: BarberProfileDto;

  private authService: AuthService = inject(AuthService);
  private barberService: BarberService = inject(BarberService);

  showEditModal = false;
  showEditAddressModal = false;

  ngOnInit(): void {
    this.fetchBarberProfile();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  fetchBarberProfile() {
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          return;
        }
        this.barberService
          .fetchBarberProfile(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.barberProfile = res;
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
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          return;
        }

        this.barberService
          .updateBarberProfile(id, updated)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.showEditModal = false;
              Swal.fire(
                'Updated!',
                'Your Profile has been Updated Successfully.',
                'success'
              );
              this.fetchBarberProfile();
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

  onEditAddress() {
    this.showEditAddressModal = true;
  }

  updateBarberAddress(address: BarberProfileDto['address']) {
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          return;
        }
        this.barberService
          .updateBarberAddress(id, address)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.showEditAddressModal = false;
              Swal.fire(
                'Updated!',
                res.message || 'Your Address has been Updated Successfully.',
                'success'
              );
              this.fetchBarberProfile();
            },
            error: (err) => {
              console.error(err);
              Swal.fire(
                'Failed!',
                err.error?.error || 'Address Updation Failed',
                'error'
              );
            },
          });
      });
  }
  isUploading = false;
  updateProfilePicture(file: File) {
    this.isUploading = true;
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) {
          this.isUploading = false;
          return;
        }

        this.barberService
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
              this.fetchBarberProfile();
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
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) return;

        this.barberService
          .deleteProfilePicture(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: (res) => {
              this.barberProfile.profilePicUrl = null;
              this.barberProfile.profilePicKey = null;
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
