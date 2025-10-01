import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  take,
} from 'rxjs';

@Component({
  selector: 'app-admin-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css',
})
export class AdminTableComponent {
  @Input() data: any[] = [];
  @Input() columns: {
    key: string;
    label: string;
    isDate?: boolean;
    isStatus?: boolean;
  }[] = [];
  @Input() currentPage = 1;
  @Input() itemsPerPage = 5;
  @Input() totalPages = 1;

  @Output() onPageChange = new EventEmitter<number>();
  @Output() onToggleStatus = new EventEmitter();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  cancelItem(item: any): void {
    this.onCancel.emit(item);
  }

  searchTerm = '';

  private searchSubject = new Subject<string>();
  private toggleSubject = new Subject();

  private searchSub!: Subscription;
  private toggleSub!: Subscription;

  constructor() {
    this.searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.onSearch.emit(term.trim());
      });

    this.toggleSub = this.toggleSubject
      .pipe(debounceTime(300))
      .subscribe((item) => {
        this.onToggleStatus.emit(item);
      });
  }

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
    this.toggleSubject.next(item);
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  editItem(item: any): void {
    this.onEdit.emit(item);
  }

  deleteItem(item: any): void {
    this.onDelete.emit(item);
  }
}
