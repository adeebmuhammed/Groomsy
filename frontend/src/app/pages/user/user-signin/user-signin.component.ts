import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-signin',
  imports: [ UserHeaderComponent,UserFooterComponent,ReactiveFormsModule,RouterModule ],
  templateUrl: './user-signin.component.html',
  styleUrl: './user-signin.component.css'
})
export class UserSigninComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.authService.userSignin({ email, password }).subscribe({
      next: (res) => {
        const name = res?.user?.name || 'User';

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${name}!`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/user/home']);
        });
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Login failed';

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.errorMessage
        });
      }
    });
  }
}


  loginWithGoogle(): void {
    window.location.href = 'http://localhost:5000/user/auth/google';
  }

}
