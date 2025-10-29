import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { ServiceFormComponent } from '../../../components/shared/service-form/service-form.component';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import Swal from 'sweetalert2';
import { Service } from '../../../interfaces/interfaces';
import { ServiceService } from '../../../services/service/service.service';
import { Subject, takeUntil } from 'rxjs';
import { ROLES } from '../../../constants/roles';

@Component({
  selector: 'app-admin-service',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    CommonModule,
    ServiceFormComponent,
    AdminTableComponent,
  ],
  templateUrl: './admin-service.component.html',
  styleUrl: './admin-service.component.css',
})
export class AdminServiceComponent implements OnInit, OnDestroy {
  serviceModalVisible = false;
  selectedServiceData: Service | null = null;
  selectedServiceId: string | null = null;

  private serviceService = inject(ServiceService);

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'duration', label: 'Duration' },
    { key: 'price', label: 'Price' },
  ];

  services: Service[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  searchTerm = '';

  ngOnInit(): void {
    this.loadServices();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loadServices(): void {
    this.serviceService
      .fetch(ROLES.ADMIN, this.searchTerm, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (response) => {
          this.services = response.data || [];
          this.totalPages = response?.pagination?.totalPages || 1;
        },
        error: (err) => {
          console.error('Error fetching services', err);
        },
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadServices();
  }

  addService(): void {
    this.selectedServiceData = null;
    this.selectedServiceId = null;
    this.serviceModalVisible = true;
  }

  editService(service: Service): void {
    this.selectedServiceData = service;
    this.selectedServiceId = service.id;
    this.serviceModalVisible = true;
  }

  deleteService(service: Service): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService
          .delete(service.id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Service has been deleted.', 'success');
              this.loadServices();
            },
            error: (err) => {
              console.error('Delete error:', err);
              Swal.fire('Error!', 'Failed to delete the service.', 'error');
            },
          });
      }
    });
  }

  onModalClose(): void {
    this.serviceModalVisible = false;
    this.selectedServiceData = null;
    this.selectedServiceId = null;
  }

  onModalSubmit(payload: any): void {
    if (this.selectedServiceId) {
      this.serviceService
        .edit(this.selectedServiceId, payload)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Service Updated',
              text: 'Service Updated Successfully',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadServices();
              this.onModalClose();
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Service Updation Failed',
            });
          },
        });
    } else {
      // Add new coupon
      this.serviceService
        .create(payload)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Service Created',
              text: 'Service Created Successfully',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadServices();
              this.onModalClose();
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Service Creation Failed',
            });
          },
        });
    }
  }
}
