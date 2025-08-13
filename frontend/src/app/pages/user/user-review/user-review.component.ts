import { Component, inject } from '@angular/core';
import { BarberDto, ReviewListResponse, ReviewResponseDto } from '../../../interfaces/interfaces';
import { BookingService } from '../../../services/booking/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ReviewService } from '../../../services/review/review.service';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-review',
  imports: [ UserHeaderComponent,UserFooterComponent,CommonModule ],
  templateUrl: './user-review.component.html',
  styleUrl: './user-review.component.css'
})
export class UserReviewComponent {
  reviews: ReviewResponseDto[] = [];
  barbers: BarberDto[] = [];
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 5;
  pages: number[] = [];
  loading = true;

  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.fetchData(userId, this.currentPage);
      }
    });
  }

  fetchData(userId: string, page: number): void {
    this.loading = true;

    forkJoin({
      reviews: this.reviewService.getAllReviewsByUser(userId, page, this.itemsPerPage),
      barbers: this.userService.fetchBarbers('', 1, 100)
    }).subscribe({
      next: ({ reviews, barbers }) => {
        this.reviews = reviews.data;
        this.barbers = barbers.data;

        this.currentPage = reviews.pagination.currentPage;
        this.totalPages = reviews.pagination.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch data', err);
        this.loading = false;
      }
    });
  }

  handlePageChange(page: number): void {
    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.fetchData(userId, page);
      }
    });
  }

  getBarberName(barberId: string): string {
    const barber = this.barbers.find(b => b.id === barberId);
    return barber ? barber.name : 'Unknown Barber';
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  confirmDelete(reviewId: string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result)=>{
      if (result.isConfirmed) {
        this.reviewService.deleteReview(reviewId).subscribe({
          next: ()=>{
            Swal.fire("Success","Review Deleted Successfully","success")
            this.authService.userId$.subscribe((id)=>{
              if (!id) {
                return
              }
              this.fetchData(id,1)
            })
          },
          error: (err)=>{
            Swal.fire("Error",err.error?.message || "Review Deletion Failed", "error")
          }
        })
      }
    })
  }
}
