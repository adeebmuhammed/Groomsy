import { Component } from '@angular/core';
import { BarberHeaderComponent } from '../../../components/barber/barber-header/barber-header.component';
import { BarberFooterComponent } from '../../../components/barber/barber-footer/barber-footer.component';
import { BarberSidebarComponent } from '../../../components/barber/barber-sidebar/barber-sidebar.component';

@Component({
  selector: 'app-barber-dashboard',
  imports: [ BarberHeaderComponent,BarberFooterComponent,BarberSidebarComponent ],
  templateUrl: './barber-dashboard.component.html',
  styleUrl: './barber-dashboard.component.css'
})
export class BarberDashboardComponent {

}
