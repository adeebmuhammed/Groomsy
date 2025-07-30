import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminTableComponent } from '../../../components/shared/admin-table/admin-table.component';
import { CouponResponseDto } from '../../../interfaces/interfaces';
import { CouponService } from '../../../services/coupon/coupon.service';
import { CouponFormComponent } from '../../../components/shared/coupon-form/coupon-form.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-coupons',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    AdminTableComponent,
    CouponFormComponent,
    CommonModule,
  ],
  templateUrl: './admin-coupons.component.html',
  styleUrl: './admin-coupons.component.css',
})
export class AdminCouponsComponent implements OnInit {
  couponModalVisible = false;
  selectedCouponData: any = null;
  selectedCouponId: string | null = null;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'startDate', label: 'Start Date', isDate: true },
    { key: 'endDate', label: 'End Date', isDate: true },
    { key: 'maxCount', label: 'Max Count' },
    { key: 'limitAmount', label: 'Limit Amount' },
    { key: 'couponAmount', label: 'Coupon Amount' },
  ];

  coupons: CouponResponseDto[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  searchTerm = '';

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService
      .getCoupons(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.coupons = response.data || [];
          this.totalPages = response?.pagination?.totalPages || 1;
        },
        error: (err) => {
          console.error('Error fetching coupons', err);
        },
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCoupons();
  }

  searchChanged(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadCoupons();
  }

  addCoupon(): void {
    this.selectedCouponData = null;
    this.selectedCouponId = null;
    this.couponModalVisible = true;
  }

  editCoupon(coupon: CouponResponseDto): void {
    this.selectedCouponData = coupon;
    this.selectedCouponId = coupon.id;
    this.couponModalVisible = true;
  }

  deleteCoupon(coupon: CouponResponseDto): void {
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
        this.couponService.deleteCoupon(coupon.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
            this.loadCoupons();
          },
          error: (err) => {
            console.error('Delete error:', err);
            Swal.fire('Error!', 'Failed to delete the coupon.', 'error');
          },
        });
      }
    });
  }

  onModalClose(): void {
    this.couponModalVisible = false;
    this.selectedCouponData = null;
    this.selectedCouponId = null;
  }

  onModalSubmit(payload: any): void {
    if (this.selectedCouponId) {
      // Edit existing coupon
      this.couponService.editCoupon(this.selectedCouponId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Coupon Updated',
            text: 'Coupon Updated Successfully',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.loadCoupons();
            this.onModalClose();
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Coupon Updation Failed',
          });
        },
      });
    } else {
      // Add new coupon
      this.couponService.addCoupon(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Coupon Created',
            text: 'Coupon Created Successfully',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.loadCoupons();
            this.onModalClose();
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Coupon Creation Failed',
          });
        },
      });
    }
  }
}