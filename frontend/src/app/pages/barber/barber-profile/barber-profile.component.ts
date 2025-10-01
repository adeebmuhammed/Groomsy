import { Component, inject, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { ProfileComponent } from '../../../components/shared/profile/profile.component';
import { BarberProfileDto, EditProfile } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { BarberService } from '../../../services/barber/barber.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { EditProfileComponent } from '../../../components/shared/edit-profile/edit-profile.component';
import { CommonModule } from '@angular/common';
import { AddressComponent } from '../../../components/shared/address/address.component';
import { AddressFormComponent } from '../../../components/shared/address-form/address-form.component';

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
  ],
  templateUrl: './barber-profile.component.html',
  styleUrl: './barber-profile.component.css',
})
export class BarberProfileComponent implements OnInit {
  barberProfile!: BarberProfileDto;

  private authService: AuthService = inject(AuthService);
  private barberService: BarberService = inject(BarberService);

  showEditModal = false;
  showEditAddressModal = false;

  ngOnInit(): void {
    this.fetchBarberProfile();
  }

  fetchBarberProfile() {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }
      this.barberService
        .fetchBarberProfile(id)
        .pipe(take(1))
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
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }

      this.barberService
        .updateBarberProfile(id, updated)
        .pipe(take(1))
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
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }
      this.barberService
        .updateBarberAddress(id, address)
        .pipe(take(1))
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
}
