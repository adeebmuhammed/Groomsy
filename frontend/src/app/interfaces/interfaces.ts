export interface IBarber {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  message?: string;
  pagination: Pagination;
}


export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminLoginResponse {
  id: string;
  name: string;
  email: string;
  message: string;
}

export interface IMessageResponse {
  message: string;
}

export interface IUserLoginResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  message: string;
}

export interface IBarberLoginResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  district: string;
  status: string;
  message: string;
}

export interface IVerifyOtpResponse {
  message: string;
  barber: {
    name: string;
    email: string;
  };
}

export interface IResendOtpResponse {
  message: string;
  user: {
    name: string;
  };
}