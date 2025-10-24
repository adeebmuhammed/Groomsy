import { Component, inject, OnInit } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';
import { DashboardStatsDto } from '../../../interfaces/interfaces';
import { BarberService } from '../../../services/barber/barber.service';
import { AuthService } from '../../../services/auth/auth.service';
import { take } from 'rxjs';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barber-dashboard',
  imports: [
    BarberHeaderComponent,
    BarberFooterComponent,
    BarberSidebarComponent,
    ChartComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './barber-dashboard.component.html',
  styleUrl: './barber-dashboard.component.css',
})
export class BarberDashboardComponent implements OnInit {
  stats: DashboardStatsDto | null = null;
  selectedFilter = '1 Month';

  private barberService: BarberService = inject(BarberService);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.authService.barberId$.pipe(take(1)).subscribe((id) => {
      if (!id) return;
      this.barberService
        .getDashboardStats(this.selectedFilter, id)
        .pipe(take(1))
        .subscribe((res) => {
          this.stats = res;
        });
    });
  }
}
