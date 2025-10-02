import { Component, inject, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminDashboardStatsDto } from '../../../interfaces/interfaces';
import { take } from 'rxjs';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminHeaderComponent, AdminFooterComponent, AdminSidebarComponent, ChartComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit{
  stats: AdminDashboardStatsDto | null = null;

  private adminService: AdminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService
      .getDashboardStats()
      .pipe(take(1))
      .subscribe((res) => {
        this.stats = res;
      });
  }
}
