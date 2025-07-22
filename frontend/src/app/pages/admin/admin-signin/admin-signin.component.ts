import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../../components/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../../components/admin/admin-footer/admin-footer.component';
import { ReactiveFormsModule,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-signin',
  imports: [ AdminHeaderComponent,AdminFooterComponent,ReactiveFormsModule ],
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.css'
})
export class AdminSigninComponent {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.adminLogin(this.loginForm.value).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: res.message || 'Welcome to the Admin Panel!',
            timer: 2000,
            showConfirmButton: false,
          });

          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.error = 'Invalid credentials';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid credentials',
          });
        },
      });
    }
  }
}
