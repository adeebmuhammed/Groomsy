import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from '../../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminService } from '../../../services/admin/admin.service';
import { DashboardStatsDto } from '../../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieChartComponent } from '../../../components/shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    ChartComponent,
    PieChartComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStatsDto | null = null;
  selectedFilter = '1 Month';

  private adminService: AdminService = inject(AdminService);

  ngOnInit(): void {
    this.loadStats();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loadStats(): void {
    this.adminService
      .getDashboardStats(this.selectedFilter)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.stats = res;
      });
  }
}
