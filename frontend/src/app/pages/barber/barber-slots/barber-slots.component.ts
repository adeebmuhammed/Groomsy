import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SlotDto } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { SlotService } from '../../../services/slot/slot.service';
import { AuthService } from '../../../services/auth/auth.service';
import { SlotFormComponent } from '../../../components/shared/slot-form/slot-form.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-barber-slots',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    CommonModule,
    SlotFormComponent,
  ],
  templateUrl: './barber-slots.component.html',
  styleUrl: './barber-slots.component.css',
})
export class BarberSlotsComponent implements OnInit, OnDestroy {
  slots: SlotDto[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  selectedSlot: SlotDto | null = null;
  showSlotModal = false;

  private slotService: SlotService = inject(SlotService);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.fetchSlots();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  fetchSlots() {
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (barberId) => {
          if (!barberId) {
            console.error('Barber ID not available');
            return;
          }

          this.slotService
            .getSlotsByBarber(barberId, this.currentPage, this.pageSize)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
              next: (data) => {
                this.slots = data.data;
                this.totalPages = data.pagination.totalPages;
              },
              error: (err) => console.error('Error fetching slots:', err),
            });
        },
        error: (err) => console.error('Error retrieving barber ID:', err),
      });
  }

  editSlot(slotId: string) {
    const slotToEdit = this.slots.find((slot) => slot.id === slotId);
    if (slotToEdit) {
      this.openEditSlotModal(slotToEdit);
    }
  }

  deleteSlot(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(() => {
      this.slotService
        .deleteSlot(id)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Slot has been deleted.', 'success');
            this.fetchSlots();
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to delete the Slot.', 'error');
            console.error('Error deleting slot:', err);
          },
        });
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchSlots();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSlots();
    }
  }

  addSlot() {
    this.openAddSlotModal();
  }

  openAddSlotModal() {
    this.selectedSlot = null;
    this.showSlotModal = true;
  }

  openEditSlotModal(slot: SlotDto) {
    this.selectedSlot = slot;
    this.showSlotModal = true;
  }

  closeSlotModal() {
    this.showSlotModal = false;
  }

  handleSlotSubmit(data: SlotDto) {
    this.authService.barberId$.subscribe({
      next: (barberId) => {
        if (!barberId) return;

        if (this.selectedSlot) {
          // UPDATE
          this.slotService
            .updateSlot(this.selectedSlot.id, data)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
              next: () => {
                this.fetchSlots();
                this.closeSlotModal();
              },
              error: (err) => {
                console.error('Error updating slot:', err);
                Swal.fire(
                  'Error!',
                  err.error?.error || 'Slot Updation Failed',
                  'error'
                );
              },
            });
        } else {
          // CREATE
          this.slotService
            .createSlot(barberId, data)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
              next: () => {
                this.fetchSlots();
                this.closeSlotModal();
              },
              error: (err) => {
                console.error('Error creating slot:', err);
                Swal.fire(
                  'Error!',
                  err.error?.error || 'An unexpected error occurred',
                  'error'
                );
              },
            });
        }
      },
      error: (err) => console.error('Barber ID fetch error:', err),
    });
  }
}
