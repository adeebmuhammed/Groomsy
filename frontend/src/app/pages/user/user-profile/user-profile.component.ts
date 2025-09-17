import { Component, inject, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { EditProfile, UserProfileDto } from '../../../interfaces/interfaces';
import { take } from 'rxjs';
import { ProfileComponent } from '../../../components/shared/profile/profile.component';
import { EditProfileComponent } from '../../../components/shared/edit-profile/edit-profile.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  imports: [
    UserHeaderComponent,
    UserFooterComponent,
    ProfileComponent,
    EditProfileComponent,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfile!: UserProfileDto;

  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);

  showEditModal = false;

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.authService.userId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }

      this.userService
        .fetchUserProfile(id)
        .pipe(take(1))
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
    console.log('clicked');
  }

  updateProfile(updated: EditProfile) {
    this.authService.userId$.pipe(take(1)).subscribe((id) => {
      if (!id) {
        return;
      }

      this.userService
        .updateUserProfile(id, updated)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
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
}
