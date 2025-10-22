import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ROLES } from '../../../constants/roles';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const name = params['name'];
      const id = params['id'];

      if (token && name && id) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', ROLES.USER);
        localStorage.setItem('userName', name);
        localStorage.setItem('userId', id);

        this.authService.updateLoginState(ROLES.USER, true, name, id);

        this.router.navigate(['/user/home']);
      } else {
        this.router.navigate(['/user/signin']);
      }
    });
  }
}
