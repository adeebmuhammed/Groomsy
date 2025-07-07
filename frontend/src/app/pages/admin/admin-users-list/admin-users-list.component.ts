import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';

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
  imports: [ AdminHeaderComponent,AdminFooterComponent,AdminSidebarComponent,CommonModule ],
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.css'
})
// admin-users-list.component.ts
export class AdminUsersListComponent implements OnInit {
  users: IUser[] = [];
  paginatedUsers: IUser[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminService.listUsers().subscribe({
      next: (res) => {
        this.users = res?.data || [];
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.setPaginatedUsers();
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
      }
    });
  }

  setPaginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPaginatedUsers();
  }

  toggleStatus(user: IUser) {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    user.status = newStatus;
  }
}
