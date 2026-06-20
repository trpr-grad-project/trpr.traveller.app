export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profileSetupCompleted: boolean;
}

export interface RegisterRequest {
  identifier: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse {
  otpId: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  value: string;
}

export interface ForgetPasswordRequest {
  identifier: string;
}

export interface ForgetPasswordResponse {
  otpId: string;
}

export interface DecodedToken {
  given_name: string;
  family_name: string;
  identifier: string;
  sub: string;
  realm_access: {
    roles: string[];
  };
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}
