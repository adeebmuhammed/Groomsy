import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import Swal from 'sweetalert2';
import { IUser } from '../../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-users-list',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    CommonModule,
    AdminTableComponent,
  ],
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.css',
})
export class AdminUsersListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  searchTerm = '';

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', isStatus: true },
    { key: 'createdAt', label: 'Created', isDate: true },
  ];

  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  fetchUsers(): void {
    this.adminService
      .listUsers(this.searchTerm, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.users = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.fetchUsers();
  }

  updateUserStatus(user: IUser): void {
    const status = user.status;

    this.adminService
      .updateUserStatus(user.id, status)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Status Updated',
            text: res.message || 'User Status Updation Successful',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            const newStatus = status === 'blocked' ? 'active' : 'blocked';
            this.users = this.users.map((u) =>
              u.id === user.id ? { ...u, status: newStatus } : u
            );
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Status Updation Failed',
            text: 'User Status Updation Failed',
          });
          console.error('Error updating user status:', err);
        },
      });
  }
}
