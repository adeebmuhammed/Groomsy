import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminTableComponent } from '../../../components/admin/admin-table/admin-table.component';

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-admin-users-list',
  imports: [ AdminHeaderComponent,AdminFooterComponent,AdminSidebarComponent,CommonModule,AdminTableComponent ],
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.css'
})
// admin-users-list.component.ts
export class AdminUsersListComponent implements OnInit {
  users: IUser[] = [];
    currentPage = 1;
    itemsPerPage = 5;
  
    columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', isStatus: true },
      { key: 'createdAt', label: 'Created', isDate: true }
    ];
  
    constructor(private adminService: AdminService) {}
  
    ngOnInit(): void {
      this.adminService.listUsers().subscribe((res) => {
        this.users = res?.data || [];
      });
    }
  
    changePage(page: number): void {
      this.currentPage = page;
    }
  
    toggleStatus(user: IUser): void {
      user.status = user.status === 'active' ? 'blocked' : 'active';
      // Optionally call API
    }
}
