import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { OfferService } from '../../../services/offer/offer.service';
import { OfferResponseDto } from '../../../interfaces/interfaces';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import { CommonModule } from '@angular/common';
import { OfferFormComponent } from '../../../components/shared/offer-form/offer-form.component';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-admin-offer',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    AdminTableComponent,
    CommonModule,
    OfferFormComponent,
  ],
  templateUrl: './admin-offer.component.html',
  styleUrl: './admin-offer.component.css',
})
export class AdminOfferComponent implements OnInit {
  offerModalVisible = false;
  selectedOfferData: OfferResponseDto | null = null;
  selectedOfferId: string | null = null;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'startDate', label: 'Start Date', isDate: true },
    { key: 'endDate', label: 'End Date', isDate: true },
    { key: 'discount', label: 'Discount' },
  ];

  offers: OfferResponseDto[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  searchTerm = '';

  private offerService: OfferService = inject(OfferService);

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService
      .getOffers(this.currentPage, this.itemsPerPage, this.searchTerm)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.offers = response.data || [];
          this.totalPages = response?.pagination?.totalPages || 1;
        },
        error: (err) => {
          console.error('Error fetching coupons', err);
        },
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOffers();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadOffers();
  }

  addOffer(): void {
    this.selectedOfferData = null;
    this.selectedOfferId = null;
    this.offerModalVisible = true;
  }

  editOffer(offer: OfferResponseDto): void {
    this.selectedOfferData = offer;
    this.selectedOfferId = offer.id;
    this.offerModalVisible = true;
  }

  deleteOffer(offer: OfferResponseDto): void {
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
        this.offerService
          .deleteOffer(offer.id)
          .pipe(take(1))
          .subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Offer has been deleted.', 'success');
              this.loadOffers();
            },
            error: (err) => {
              console.error('Delete error:', err);
              Swal.fire('Error!', 'Failed to delete the offer.', 'error');
            },
          });
      }
    });
  }

  onModalClose(): void {
    this.offerModalVisible = false;
    this.selectedOfferData = null;
    this.selectedOfferId = null;
  }

  onModalSubmit(payload: any): void {
    if (this.selectedOfferId) {
      // Edit existing coupon
      this.offerService
        .editOffer(this.selectedOfferId, payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Offer Updated',
              text: 'Offer Updated Successfully',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadOffers();
              this.onModalClose();
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Offer Updation Failed',
            });
          },
        });
    } else {
      // Add new coupon
      this.offerService
        .addOffer(payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Offer Created',
              text: 'Offer Created Successfully',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadOffers();
              this.onModalClose();
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Offer Creation Failed',
            });
          },
        });
    }
  }
}
