export interface ReviewCreateRequestDto {
  reviewText: string;
  rating: number;
}

export interface ReviewResponseDto {
  id: string;
  booking: string;
  barber: string;
  rating: number;
  reviewText: string;
}
