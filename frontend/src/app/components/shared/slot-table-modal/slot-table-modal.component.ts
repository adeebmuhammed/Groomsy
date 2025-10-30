import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SlotResponse, SlotTime } from '../../../interfaces/interfaces';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slot-table-modal',
  imports: [CommonModule],
  templateUrl: './slot-table-modal.component.html',
  styleUrl: './slot-table-modal.component.css',
})
export class SlotTableModalComponent {
  @Input() slots: SlotResponse = {};
  @Input() date = '';

  @Output() onBookSlot = new EventEmitter<{ slot: SlotTime; date: string }>();

  getDates(): string[] {
    return Object.keys(this.slots);
  }

  book(slot: SlotTime, date: string) {
    this.onBookSlot.emit({ slot, date });

    const modalEl = document.getElementById('slotTableModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  formatTimeUTC(dateStr: Date): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  }
}
