export class AdminLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  message!: string;
}

export class ListResponseDto<T> {
  data!: T[];
  message?: string;
  pagination!: {
      currentPage: number,
      totalPages: number,
      totalItems: number,
      itemsPerPage: number
  }
}

export class UserDto {
  id!: string;
  name!: string;
  email!: string;
  status!: string;
  createdAt!: Date;
}

export class BarberDto {
  id!: string;
  name!: string;
  email!: string;
  status!: string;
  district!:string;
  createdAt!: Date;
}

export class AdminDashboardStatsResponseDto {
  totalUsers!: number;
  totalBarbers!: number;
  totalBookings!: number;
}