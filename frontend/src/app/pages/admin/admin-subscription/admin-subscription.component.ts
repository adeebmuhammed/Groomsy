import { Component, inject, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import {
  CreateSubscriptionPlanDto,
  SubscriptionPlanDto,
} from '../../../interfaces/interfaces';
import { SubscriptionPlanService } from '../../../services/subscription-plan/subscription-plan.service';
import Swal from 'sweetalert2';
import { SubscriptionFormComponent } from '../../../components/shared/subscription-form/subscription-form.component';

@Component({
  selector: 'app-admin-subscription',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    AdminTableComponent,
    SubscriptionFormComponent,
  ],
  templateUrl: './admin-subscription.component.html',
  styleUrl: './admin-subscription.component.css',
})
export class AdminSubscriptionComponent implements OnInit {
  plans: SubscriptionPlanDto[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  searchTerm = '';
  displayPlanFormModal: boolean = false;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'renewalPrice', label: 'Renewal Price' },
    { key: 'duration', label: 'Duration' },
    { key: 'durationUnit', label: 'Duration Unit' },
    { key: 'features', label: 'Features' }, // 👈 Added
    { key: 'status', label: 'Active', isStatus: true },
  ];

  private planService = inject(SubscriptionPlanService);

  ngOnInit(): void {
    this.fetchPlans();
  }

  fetchPlans() {
    this.planService
      .fetch(this.searchTerm, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.plans = (res.data || []).map((p: SubscriptionPlanDto) => ({
            ...p,
            status: p.isActive ? 'active' : 'inactive',
            features: p.features || [], // 👈 ensure features always exists
          }));

          this.totalPages = res?.pagination?.totalPages || 1;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchPlans();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.fetchPlans();
  }

  updateActivation(plan: SubscriptionPlanDto) {
    this.planService.updateActivation(plan.id).subscribe({
      next: (res) => {
        Swal.fire(
          'Updated',
          res.message || "Subscription plan's Activation Updated Successfully",
          'success'
        ).then(() => {
          this.plans = this.plans.map((p) =>
            p.id === plan.id
              ? {
                  ...p,
                  isActive: !plan.isActive,
                  status: !plan.isActive ? 'active' : 'inactive',
                }
              : p
          );
        });
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err.error.message || "Subscription plan's Activation Updation Failed",
          'error'
        );
      },
    });
  }

  createPlan(data: CreateSubscriptionPlanDto) {
    this.planService.create(data).subscribe({
      next: (res) => {
        Swal.fire(
          'Created',
          res.message || 'Subscription plan Created Successfully',
          'success'
        );
        this.modalClose();
        this.fetchPlans();
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err.error.message || 'Subscription plan Creation Failed',
          'error'
        );
      },
    });
  }

  showModal() {
    this.displayPlanFormModal = true;
  }

  modalClose() {
    this.displayPlanFormModal = false;
  }
}
