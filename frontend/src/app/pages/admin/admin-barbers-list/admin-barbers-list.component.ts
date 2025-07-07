import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';

interface IBarber {
  _id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-admin-barbers-list',
  imports: [ AdminHeaderComponent,AdminFooterComponent,AdminSidebarComponent,CommonModule],
  templateUrl: './admin-barbers-list.component.html',
  styleUrl: './admin-barbers-list.component.css'
})

export class AdminBarbersListComponent {
  barbers: IBarber[] = [];
  paginatedBarbers: IBarber[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchBarbers();
  }

  fetchBarbers(): void {
    this.adminService.listBarbers().subscribe({
      next: (res) => {
        this.barbers = res?.data || [];
        this.totalPages = Math.ceil(this.barbers.length / this.itemsPerPage);
        this.setPaginatedBarbers();
      },
      error: (err) => {
        console.error('Failed to fetch barbers:', err);
      }
    });
  }

  setPaginatedBarbers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedBarbers = this.barbers.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedBarbers();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  toggleStatus(barber: IBarber): void {
    barber.status = barber.status === 'active' ? 'blocked' : 'active';
    // Optionally make an API call to update status
  }
}
