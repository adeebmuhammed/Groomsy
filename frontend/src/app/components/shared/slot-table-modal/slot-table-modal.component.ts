import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SlotResponse, SlotTime } from '../../../interfaces/interfaces';
import * as bootstrap from 'bootstrap'
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-slot-table-modal',
  imports: [ CommonModule],
  templateUrl: './slot-table-modal.component.html',
  styleUrl: './slot-table-modal.component.css'
})
export class SlotTableModalComponent {
  @Input() slots: SlotResponse = {};
  @Input() date: string = '';

  @Output() onBookSlot = new EventEmitter<{ slot: SlotTime; date: string }>();

  getDates(): string[] {
    return Object.keys(this.slots);
  }

  book(slot: SlotTime, date: string) {
    this.onBookSlot.emit({ slot, date });

    // Optional: Close modal from inside (if needed)
    const modalEl = document.getElementById('slotTableModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  formatTimeUTC(dateStr: Date): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
}

}
