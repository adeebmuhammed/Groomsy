import { Component } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';

@Component({
  selector: 'app-user-home',
  imports: [ UserHeaderComponent,UserFooterComponent ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent{
  constructor() {}
}