export const USER_BASE = 'user';

export const USER_ROUTES_PATHS = {
  HOME: `${USER_BASE}/home`,
  AUTH_CALLBACK: `${USER_BASE}/auth-callback`,
  SIGNIN: `${USER_BASE}/signin`,
  SIGNUP: `${USER_BASE}/signup`,
  VERIFY_OTP: `${USER_BASE}/verify-otp`,
  FORGOT_PASSWORD: `${USER_BASE}/forgot-password`,
  RESET_PASSWORD: `${USER_BASE}/reset-password`,
  BARBERS: `${USER_BASE}/barbers`,
  FAVORITES: `${USER_BASE}/favorites`,
  BARBER_DETAILS: `${USER_BASE}/barber-details/:id`,
  BOOKINGS: `${USER_BASE}/bookings`,
  BOOKING_CONFIRMATION: `${USER_BASE}/booking-confirmation/:id`,
  REVIEW : `${USER_BASE}/reviews`
};