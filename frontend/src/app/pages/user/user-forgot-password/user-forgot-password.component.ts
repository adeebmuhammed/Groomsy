import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-forgot-password',
  imports: [ UserHeaderComponent,UserFooterComponent,ReactiveFormsModule,RouterModule ],
  templateUrl: './user-forgot-password.component.html',
  styleUrl: './user-forgot-password.component.css'
})
export class UserForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.userForgotPassword(email).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Reset link sent to your email.',
            confirmButtonText: 'OK'
          }).then(() => {
            localStorage.setItem('userForgotEmail', email);
            this.router.navigate(['/user/verify-otp'], { queryParams: { purpose: 'forgot' } });
          });
        },
        error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.',
          });
        }
      });
    }
  }
}