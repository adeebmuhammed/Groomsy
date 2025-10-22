import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAdminLoginResponse, IBarberLoginResponse, IMessageResponse, IResendOtpResponse, IUserLoginResponse, IVerifyOtpResponse } from '../../interfaces/interfaces';
import { ROLES } from '../../constants/roles';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private API_URL = environment.apiBaseUrl;

  private http: HttpClient = inject(HttpClient);

  // --- ADMIN subjects ---
  private isAdminLoggedInSubject = new BehaviorSubject<boolean>(this.hasRoleToken(ROLES.ADMIN));
  private adminNameSubject = new BehaviorSubject<string | null>(localStorage.getItem('adminName'));
  private adminIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('adminId'));

  isAdminLoggedIn$ = this.isAdminLoggedInSubject.asObservable();
  adminName$ = this.adminNameSubject.asObservable();
  adminId$ = this.adminIdSubject.asObservable();

  // --- USER subjects ---
  private isUserLoggedInSubject = new BehaviorSubject<boolean>(this.hasRoleToken(ROLES.USER));
  private userNameSubject = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
  private userIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('userId'));

  isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

  // --- BARBER subjects ---
  private isBarberLoggedInSubject = new BehaviorSubject<boolean>(this.hasRoleToken(ROLES.BARBER))
  private barberNameSubject = new BehaviorSubject<string | null>(localStorage.getItem('barberName'))
  private barberIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('barberId'))

  isBarberLoggedIn$ = this.isBarberLoggedInSubject.asObservable()
  barberName$ = this.barberNameSubject.asObservable()
  barberId$ = this.barberIdSubject.asObservable()

  private hasRoleToken(role: string): boolean {
    return !!localStorage.getItem('token') && localStorage.getItem('role') === role;
  }

  // Update login state for roles
  updateLoginState(role: ROLES, isLoggedIn: boolean, name: string | null, id: string | null) {
    localStorage.setItem(`${role}Name`, name || '');
    localStorage.setItem(`${role}Id`, id || '');
    
    
    if (role === ROLES.ADMIN) {
      this.isAdminLoggedInSubject.next(isLoggedIn);
      this.adminNameSubject.next(name);
      this.adminIdSubject.next(id);
    } else if (role === ROLES.USER) {
      this.isUserLoggedInSubject.next(isLoggedIn);
      this.userNameSubject.next(name);
      this.userIdSubject.next(id);
    } else if (role === ROLES.BARBER) {
      this.isBarberLoggedInSubject.next(isLoggedIn)
      this.barberNameSubject.next(name)
      this.barberIdSubject.next(id)
    }

  }


  // Admin 
  adminLogin(credentials: { email: string; password: string }): Observable<IAdminLoginResponse> {
  return new Observable(observer => {
    this.http.post<IAdminLoginResponse>(`${this.API_URL}/admin/login`, credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('role', ROLES.ADMIN);
        localStorage.setItem('token',res.token)
        this.updateLoginState(ROLES.ADMIN, true, res.user.name, res.user.Id);

        observer.next(res);
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}

  adminLogout(): Observable<{ message: string }> {
    return new Observable(observer => {
      this.http.post<{ message: string }>(`${this.API_URL}/admin/logout`, {}).subscribe({
        next: res => {
          localStorage.clear();
          this.updateLoginState(ROLES.ADMIN, false, null, null);
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  // User
  userSignup(credentials: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.API_URL}/user/signup`, credentials);
  }

  userVerifyOtp(data: { email: string; otp: string; purpose: 'signup' | 'forgot' }): Observable<{ message: string; user: { name: string; email: string } }> {
  return new Observable(observer => {
    this.http.post<{ message: string; user: { name: string; email: string } }>(`${this.API_URL}/user/verify-otp`, data).subscribe({
      next: (res: any) => {
        observer.next(res);
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}


  userResendOtp(data: { email: string; purpose: 'signup' | 'forgot' }): Observable<{ message: string; user: { name: string } }> {
  return this.http.post<{ message: string; user: { name: string } }>(`${this.API_URL}/user/resend-otp`, data);
}

  userSignin(data: { email: string; password: string }): Observable<{ message: string; user: IUserLoginResponse }> {
  return new Observable(observer => {
    this.http.post<{ message: string; user: IUserLoginResponse }>(`${this.API_URL}/user/login`, data).subscribe({
      next: (res: any) => {
        localStorage.setItem('role', ROLES.USER);
        localStorage.setItem('token',res?.user?.token)
        const name = res.user?.name || '';
        const userId = res.user?.id || '';

        this.updateLoginState(ROLES.USER, true, name, userId);

        observer.next(res); // pass to component
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}


  userForgotPassword(email: string): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.API_URL}/user/forgot-password`, { email });
  }

  userResetPassword(data: {email: string|null, password: string, confirmPassword: string}):Observable<IMessageResponse>{
    return this.http.post<IMessageResponse>(`${this.API_URL}/user/reset-password`,data)
  }
  
  userLogout(): Observable<IMessageResponse> {
    return new Observable(observer => {
      this.http.post<IMessageResponse>(`${this.API_URL}/user/logout`, {}).subscribe({
        next: res => {
          localStorage.clear();
          this.updateLoginState(ROLES.USER, false, null, null);
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  // Barber
  barberSignup(data:{
    name: string;
    email: string;
    phone: string;
    district: string;
    password: string;
    confirmPassword: string;
  }):Observable<IMessageResponse>{
    return this.http.post<IMessageResponse>(`${this.API_URL}/barber/signup`,data)
  }

  barberVerifyOtp(data: { email: string; otp: string; purpose: 'signup' | 'forgot' }): Observable<IVerifyOtpResponse> {
  return new Observable(observer => {
    this.http.post<IVerifyOtpResponse>(`${this.API_URL}/barber/verify-otp`, data).subscribe({
      next: (res: any) => {
        observer.next(res);
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}


  barberResendOtp(data: { email: string; purpose: 'signup' | 'forgot' }): Observable<IResendOtpResponse> {
    return this.http.post<IResendOtpResponse>(`${this.API_URL}/barber/resend-otp`, data);
  }

  barberSignin(credentials: { email: string; password: string }): Observable<IBarberLoginResponse> {
    return new Observable(observer => {
      this.http.post<IBarberLoginResponse>(`${this.API_URL}/barber/login`, credentials).subscribe({
        next: (res: any) => {
          localStorage.setItem('role', ROLES.BARBER);
          localStorage.setItem('token',res?.token)
          this.updateLoginState(ROLES.BARBER, true, res.name, res.id);
          
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }


  barberForgotPassword(email: string): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.API_URL}/barber/forgot-password`, { email }, { withCredentials: true});
  }

  barberResetPassword(data: {email: string|null, password: string, confirmPassword: string}):Observable<IMessageResponse>{
    return this.http.post<IMessageResponse>(`${this.API_URL}/barber/reset-password`,data)
  }

  barberLogout():Observable<IMessageResponse>{
    return new Observable(observer => {
      this.http.post<IMessageResponse>(`${this.API_URL}/barber/logout`, {}).subscribe({
        next: res => {
          localStorage.clear();
          this.updateLoginState(ROLES.BARBER, false, null, null);
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}