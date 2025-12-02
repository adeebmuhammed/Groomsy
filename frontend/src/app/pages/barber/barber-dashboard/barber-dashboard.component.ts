import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { DashboardStatsDto } from '../../../interfaces/interfaces';
import { BarberService } from '../../../services/barber/barber.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from '../../../components/shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-barber-dashboard',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    ChartComponent,
    PieChartComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './barber-dashboard.component.html',
  styleUrl: './barber-dashboard.component.css',
})
export class BarberDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStatsDto | null = null;
  selectedFilter = '1 Month';

  private barberService: BarberService = inject(BarberService);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.loadStats();
  }

  componentDestroyed$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loadStats(): void {
    this.authService.barberId$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((id) => {
        if (!id) return;
        this.barberService
          .getDashboardStats(this.selectedFilter, id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe((res) => {
            this.stats = res;
          });
      });
  }
}
