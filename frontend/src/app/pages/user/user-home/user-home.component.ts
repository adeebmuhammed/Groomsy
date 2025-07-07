import { Component } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { ActivatedRoute,Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-home',
  imports: [ UserHeaderComponent,UserFooterComponent ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   const token = params['token'];
    //   const name = params['name'];
    //   const email = params['email'];

    //   if (token && name && email) {
    //     localStorage.setItem('token', token);
    //     localStorage.setItem('role', 'user');
    //     localStorage.setItem('userName', name);
    //     localStorage.setItem('userEmail', email);

    //     this.authService.updateLoginState('user', true, name, email);

    //     // Optional: remove token from URL
    //     this.router.navigate([], { queryParams: {} });
    //   }
    // });
  }
}