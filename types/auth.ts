export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface RegisterData {
  identifier: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profileSetupCompleted: boolean;
}
