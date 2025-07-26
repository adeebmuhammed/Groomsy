import { Component, OnInit } from '@angular/core';
import { ISlot, SlotDto } from '../../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { SlotService } from '../../../services/slot/slot.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-barber-slots',
  imports: [ BarberHeaderComponent,BarberFooterComponent,BarberSidebarComponent,DatePipe,CommonModule ],
  templateUrl: './barber-slots.component.html',
  styleUrl: './barber-slots.component.css'
})
export class BarberSlotsComponent implements OnInit {
  slots: SlotDto[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private http: HttpClient, private slotService: SlotService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchSlots();
  }

  fetchSlots() {
  this.authService.barberId$.subscribe({
    next: (barberId) => {
      if (!barberId) {
        console.error('Barber ID not available');
        return;
      }

      this.slotService.getSlotsByBarber(barberId, this.currentPage, this.pageSize)
        .subscribe({
          next: (data) => {
            this.slots = data.data;
            
            this.totalPages = data.pagination.totalPages;
          },
          error: (err) => console.error('Error fetching slots:', err),
        });
    },
    error: (err) => console.error('Error retrieving barber ID:', err)
  });
}


  editSlot(id: string) {
    console.log('Editing slot with id:', id);
    // Navigate or open modal here
  }

  deleteSlot(id: string) {
    if (confirm('Are you sure you want to delete this slot?')) {
      this.http.delete(`/api/slots/${id}`).subscribe({
        next: () => {
          this.fetchSlots(); // Refresh current page
        },
        error: (err) => console.error('Error deleting slot:', err),
      });
    }
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
}
