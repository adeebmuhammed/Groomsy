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
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
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
  district!: string;
  createdAt!: Date;
}

export interface AdminDashboardStatsDto {
  filter: string;
  bookings: {
    type: "bookings";
    labels: string[];
    data: number[];
    total: number;
  };
  revenue: {
    type: "revenue";
    labels: string[];
    data: number[];
    total: number;
  };
  services: {
    type: "services";
    labels: string[];
    data: number[];
    total: number;
  };
}
