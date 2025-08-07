import { Component, inject, Injectable, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { BarberUnavailabilityDto } from '../../../interfaces/interfaces';
import { BarberUnavailabilityService } from '../../../services/barber-unavailability/barber-unavailability.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-unavailability',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './barber-unavailability.component.html',
  styleUrl: './barber-unavailability.component.css',
})
export class BarberUnavailabilityComponent implements OnInit {
  barberId: string = '';
  unavailabilityData?: BarberUnavailabilityDto;

  newOffDate: string = '';
  newOffReason: string = '';
  newWeeklyOff: string = '';

  loading = false;
  error = '';

  validDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  private unavailabilityService = inject(BarberUnavailabilityService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.barberId$.subscribe((id) => {
      if (id) {
        this.barberId = id;
      }
    });
    this.fetchUnavailability();
  }

  fetchUnavailability(): void {
    this.loading = true;
    this.unavailabilityService
      .fetchBarberUnavailability(this.barberId)
      .subscribe({
        next: (data) => {
          this.unavailabilityData = data;
          this.newWeeklyOff = data.weeklyOff;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to load unavailability data';
          this.loading = false;
        },
      });
  }

  updateWeeklyOff(): void {
    if (!this.newWeeklyOff) return;
    this.unavailabilityService
      .editWeeklyDayOff(this.barberId, this.newWeeklyOff)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Updation Successful',
            text: res.message || 'Weekly day off updated successfully.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.fetchUnavailability();
          });
        },
        error: (err) =>
        Swal.fire('Error!', 'Failed to update weekly off', 'error'),
      });
  }

  addSpecialOff(): void {
    if (!this.newOffDate || !this.newOffReason) return;
    this.unavailabilityService
      .addOffDay(this.barberId, {
        date: this.newOffDate,
        reason: this.newOffReason,
      })
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Added Successfully',
            text: res.message || 'special day off added successfully.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.newOffDate = '';
            this.newOffReason = '';
            this.fetchUnavailability();
          });
        },
        error: (err) => Swal.fire('Error!', 'Failed to add special off', 'error'),
      });
  }

  removeSpecialOff(date: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.unavailabilityService.removeOffDay(this.barberId, date).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Removed Successfully',
              text: res.message || 'special day off removed successfully.',
              confirmButtonText: 'OK',
            }).then(() => {
              this.fetchUnavailability();
            });
          },
          error: (err) =>
            Swal.fire('Error!', 'Failed to remove special off', 'error')
        });
      }
    });
  }
}
