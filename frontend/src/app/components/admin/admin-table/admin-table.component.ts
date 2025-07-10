import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import { Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-table',
  imports: [ CommonModule,FormsModule ],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; isDate?: boolean; isStatus?: boolean }[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;

  @Output() onPageChange = new EventEmitter<number>();
  @Output() onToggleStatus = new EventEmitter<any>();

  paginatedData: any[] = [];
  filteredData: any[] = [];
  totalPages = 1;
  searchTerm: string = '';

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.paginatedData = this.filteredData.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
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
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      this.columns.some(col =>
        String(item[col.key]).toLowerCase().includes(term)
      )
    );
    this.currentPage = 1;
    this.updatePagination();
  }
}