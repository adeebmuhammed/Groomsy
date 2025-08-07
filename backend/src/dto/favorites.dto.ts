import { BarberDto } from "./barber.dto";


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