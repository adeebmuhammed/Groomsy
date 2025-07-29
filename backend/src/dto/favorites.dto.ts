import { BarberDto } from "./barber.dto";

export class MessageResponseDto {
  message!: string;
}

export interface FavoritesListResponseDto {
  data: BarberDto[];
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}