export interface UserTokenPayload {
  sub: string;
  email: string;
  profileImageUrl?: string;
  role: string;
  type: string;
  aud: string | string[];
  iss: string;
  exp: number;
}

export interface AuthUser extends UserTokenPayload {
  uuid: string;
}

export interface AuthResponseData {
  accessToken: string;
}

export interface RegisterInputs {
  email: string;
  password: string;
  fullName: string;
  birthDate: string;
  role: { name: 'CUSTOMER' };
}

export interface LoginInputs {
  email: string;
  password: string;
}
