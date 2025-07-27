import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { BarberDto, PaginatedResponse } from '../../../interfaces/interfaces';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { BarberCardComponent } from '../../../components/shared/barber-card/barber-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-barber',
  imports: [ UserHeaderComponent,UserFooterComponent,BarberCardComponent,CommonModule,FormsModule ],
  templateUrl: './user-barber.component.html',
  styleUrl: './user-barber.component.css'
})
export class UserBarberComponent {
   barbers: BarberDto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 4;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchBarbers();
  }

  fetchBarbers(): void {
    this.userService.fetchBarbers(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (res: PaginatedResponse<BarberDto>) => {
        this.barbers = res.data;
        this.totalPages = res.pagination.totalPages;
      },
      error: (err) => console.error('Error fetching barbers:', err)
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchBarbers();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBarbers();
    }
  }
}