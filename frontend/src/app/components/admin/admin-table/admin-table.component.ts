import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-table',
  imports: [ CommonModule,FormsModule ],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent{
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; isDate?: boolean; isStatus?: boolean }[] = [];
  @Input() currentPage = 1;
  @Input() itemsPerPage = 5;
  @Input() totalPages = 1;

  @Output() onPageChange = new EventEmitter<number>();
  @Output() onToggleStatus = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<string>();

  searchTerm = '';

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.onPageChange.emit(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  toggleStatus(item: any): void {
    this.onToggleStatus.emit(item);
  }

  onSearchChange(): void {
    this.onSearch.emit(this.searchTerm.trim());
  }
}