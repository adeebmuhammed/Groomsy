import { Component } from '@angular/core';
import { UserHeaderComponent } from '../../../components/user/user-header/user-header.component';
import { UserFooterComponent } from '../../../components/user/user-footer/user-footer.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router,RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-signup',
  imports: [ UserHeaderComponent,UserFooterComponent,ReactiveFormsModule,RouterModule ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css'
})
export class UserSignupComponent {
  signupForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
      ]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.matchPasswords });
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
  if (this.signupForm.valid) {
    const formData = this.signupForm.value;

    this.authService.userSignup(formData).subscribe({
      next: (res: any) => {
        // Store email temporarily for OTP verification
        localStorage.setItem('userSignupName', this.signupForm.value.name);
        localStorage.setItem('userSignupEmail', this.signupForm.value.email);


        // Show success alert with message from server (res.message)
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: res.message || 'Please verify your email with the OTP sent.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirect after alert confirmation
          this.router.navigate(['user/verify-otp']);
        });
      },
      error: (err) => {
        console.error('Signup Error:', err);
        this.errorMessage = 'Signup failed. Please try again.';

        // Optional: Show error with SweetAlert too
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: this.errorMessage,
        });
      }
    });
  }
}


  signUpWithGoogle() {
  window.location.href = `${environment.apiBaseUrl}/user/auth/google`;
}

}