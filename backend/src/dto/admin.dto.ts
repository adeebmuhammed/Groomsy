export class ListResponseDto<T> {
  data!: T[];
  message?: string;
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