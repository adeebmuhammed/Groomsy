import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminTableComponent } from '../../../components/admin/admin-table/admin-table.component';

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
  imports: [ AdminHeaderComponent,AdminFooterComponent,AdminSidebarComponent,CommonModule,AdminTableComponent ],
  templateUrl: './admin-barbers-list.component.html',
  styleUrl: './admin-barbers-list.component.css'
})

export class AdminBarbersListComponent implements OnInit {
  barbers: IBarber[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'district', label: 'District' },
    { key: 'status', label: 'Status', isStatus: true },
    { key: 'createdAt', label: 'Created', isDate: true }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listBarbers().subscribe((res) => {
      this.barbers = res?.data || [];
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  toggleStatus(barber: IBarber): void {
    barber.status = barber.status === 'active' ? 'blocked' : 'active';
    // Optionally call API
  }
}
