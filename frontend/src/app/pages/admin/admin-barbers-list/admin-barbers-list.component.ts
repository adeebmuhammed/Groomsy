import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminTableComponent } from '../../../components/admin/admin-table/admin-table.component';
import Swal from 'sweetalert2';
import { IBarber } from '../../../interfaces/interfaces';

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
  totalPages = 1;
  searchTerm = '';

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
    this.fetchBarbers()
  }

  fetchBarbers(): void {
    this.adminService.listBarbers(this.searchTerm, this.currentPage, this.itemsPerPage)
      .subscribe((res) => {
        this.barbers = res?.data || [];
        this.totalPages = res?.pagination?.totalPages || 1;
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchBarbers();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.fetchBarbers();
  }

  updateBarberStatus(barber: IBarber): void {
        const status = barber.status;
        
        this.adminService.updateBarberStatus(barber.id, status).subscribe({
          next: (res) => {
            Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        text: res.message || 'Barber Status Updation Successful',
                        timer: 2000,
                        showConfirmButton: false,
                      }).then(()=>{
                        this.fetchBarbers()
                      })
          },
          error: (err) => {
            Swal.fire({
                        icon: 'error',
                        title: 'Status Updation Failed',
                        text: 'Barber Status Updation Failed',
                      });
            console.error('Error updating barber status:', err);
          }
        });
      }
}
